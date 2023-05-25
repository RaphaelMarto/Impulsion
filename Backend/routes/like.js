var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();

router.put("/add/:nameMusic/:userId", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const userId = req.params.userId;
  try {
    let numlike = (await admin.firestore().collection("Liked").doc(name).get()).data().like;

    admin
      .firestore()
      .collection("Liked")
      .doc(name)
      .update({
        idUserLike: admin.firestore.FieldValue.arrayUnion(userId),
        like: ++numlike,
      });
    res.status(200).send();
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.delete("/del/:nameMusic/:userId", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const userId = req.params.userId;

  try {
    const likeInfo = (await admin.firestore().collection("Liked").doc(name).get()).data();
    let numlike = likeInfo.like;
    const idUser = likeInfo.idUserLike.indexOf(userId);

    admin
      .firestore()
      .collection("Liked")
      .doc(name)
      .update({
        idUserLike: admin.firestore.FieldValue.arrayRemove(likeInfo.idUserLike[idUser]),
        like: --numlike,
      });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/liked/:nameMusic/:userId", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const userId = req.params.userId;
  try {
    let userLiking = (await admin.firestore().collection("Liked").doc(name).get()).data().idUserLike;

    if (userLiking.indexOf(userId) !== -1) {
      res.status(200).send({res : true});
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
