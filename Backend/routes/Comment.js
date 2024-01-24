var express = require("express");
const { authenticate } = require("../middleware/auth");
var router = express.Router();
const { Comment, User } = require("../models");
const { Op,literal } = require("sequelize");
const MyError = require("../middleware/Error");

router.post("/add/:idMusic", authenticate, async (req, res) => {
  const MusicId = req.params.idMusic;
  const comment = req.body.comment;
  const ReplyId = req.body.reply;

  try {
    const NewComment = await Comment.create({
      idMusic: MusicId,
      idUser: JSON.parse(req.cookies.user_session).ID,
      RepliedToComId: ReplyId,
      Message: comment,
    });
    res.status(200).send();
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message });
  }
});

router.delete("/del/:commentId", authenticate, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    await Comment.destroy({
      where: { RepliedToComId: commentId },
    });

    const commentsToDelete = await Comment.findAll({
      where: { RepliedToComId: null },
      attribute: ["id"],
    });

    const commentIdsToDelete = commentsToDelete.map((comment) => comment.id);
    await Comment.destroy({
      where: {
        [Op.or]: [
          { id: commentIdsToDelete },
          { id: commentId }
        ]
      }
    });

    res.send().status(200);
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message });
  }
});

router.get("/comment/anon/:idMusic", async (req, res) => {
  const idMusic = isNaN(req.params.idMusic) ? false : parseInt(req.params.idMusic, 10);
  try {
    if(idMusic === false){
      throw new MyError('param are wrong', 500)
    }
    const nbCom = await Comment.count({ where: { idMusic: idMusic } });

    res.status(200).send({ nbCom: nbCom });
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/comment/:idMusic/:idReply", async (req, res) => {
  const idMusic = isNaN(req.params.idMusic) ? false : parseInt(req.params.idMusic, 10);
  const idReply = isNaN(req.params.idReply) ? false : parseInt(req.params.idReply, 10);
  try {
    if(idMusic === false || idReply === false){
      throw new MyError('param are wrong', 500)
    }
    const comments = await Comment.findAll({
      where: {
        [Op.and]: [
          { idMusic: idMusic  },
          { RepliedToComId: idReply }
        ]
      },
      attributes: ['id','Message', 'createdAt',[literal(`(SELECT COUNT(*) FROM Comments AS Replies WHERE Replies.RepliedToComId = Comment.id)`), 'replyCount']],
      include: [
        {
          model: User,
          attributes: ['id','Nickname', 'PictureUrl'],
        },
      ],
      order: [['createdAt', 'ASC']], 
    });

    res.json(comments).status(200)
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;
