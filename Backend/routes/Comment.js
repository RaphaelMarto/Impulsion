var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();
const crypto = require("crypto");
const { Comment, User } = require("../models");
const { Op,literal } = require("sequelize");

router.post("/add/:idMusic", authenticate, async (req, res) => {
  const MusicId = req.params.idMusic;
  const comment = req.body.comment;
  const ReplyId = req.body.reply;

  try {
    const NewComment = await Comment.create({
      idMusic: MusicId,
      idUser: req.cookies.user_session[1],
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
  const idMusic = req.params.idMusic;
  try {
    const nbCom = await Comment.count({ where: { idMusic: idMusic } });

    res.status(200).send({ nbCom: nbCom });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/comment/:idMusic/:idReply", async (req, res) => {
  const idMusic =  req.params.idMusic;
  const idReply =  req.params.idReply;
  try {
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
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
