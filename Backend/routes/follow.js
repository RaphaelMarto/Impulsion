var express = require("express");
const { authenticate } = require("../middleware/auth");
var router = express.Router();
const { Follow, User } = require("../models");
const MyError = require("../middleware/Error");

router.get("/all", async (req, res) => {
  const followInfo = await Follow.findAll({
    where: { idUserFollowing: req.cookies.user_session[1] },
    attributes: ["idUserFollowed"],
    raw: true,
  }).then((followeds) => {
    const followedUserIds = followeds.map((followed) => followed.idUserFollowed);

    return User.findAll({
      where: {
        id: followedUserIds,
      },
      attributes: ["id", "Nickname"],
    });
  });
  if (followInfo.length == 0 || !Array.isArray(followInfo)) throw new MyError("You don't follow anyone", 404);
  res.status(200).json(followInfo);
});

router.get("/new/:followedId", authenticate, async (req, res) => {
  try {
    const newFollow = await Follow.create({
      idUserFollowing: req.cookies.user_session[1],
      idUserFollowed: req.params.followedId,
    });

    res.send({ res: true });
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/following/:followID", async (req, res) => {
  try {
    const followedId = parseInt(req.params.followID);

    const followInfo = await Follow.findOne({
      where: {
        idUserFollowing: req.cookies.user_session[1],
        idUserFollowed: followedId,
      },
      attributes: ["idUserFollowed"],
    });

    const isFollowed = !!followInfo;
    let isMe  = false;
    console.log(req.params.followID,req.cookies.user_session[1],"idddd",req.params.followID === req.cookies.user_session[1])
    if(followedId === req.cookies.user_session[1]){
      console.log('got in')
      isMe = true
    }
    res.status(200).send({isFollowed:isFollowed, isMe:isMe});
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete("/:followedId", authenticate, async (req, res) => {
  const followedId = req.params.followedId;

  try {
    const deletedRows = await Follow.destroy({
      where: {
        idUserFollowing: req.cookies.user_session[1],
        idUserFollowed: followedId,
      },
    });
    if (deletedRows < 0) throw new MyError("Not following this user", 401);
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;
