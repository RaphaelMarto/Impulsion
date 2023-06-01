var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();

router.put("/add/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  try {
    let numlike = (await admin.firestore().collection("Liked").doc(name).get()).data().like;

    admin
      .firestore()
      .collection("Liked")
      .doc(name)
      .update({
        idUserLike: admin.firestore.FieldValue.arrayUnion(req.uid),
        like: ++numlike,
      });
    res.status(200).send();
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.delete("/del/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;

  try {
    const likeInfo = (await admin.firestore().collection("Liked").doc(name).get()).data();
    let numlike = likeInfo.like;
    const idUser = likeInfo.idUserLike.indexOf(req.uid);

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

router.get("/liked/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  try {
    let userLiking = (await admin.firestore().collection("Liked").doc(name).get()).data().idUserLike;
    let nbLike = (await admin.firestore().collection("Liked").doc(name).get()).data().like;

    if (userLiking.indexOf(req.uid) !== -1) {
      res.status(200).send({res : true, like:nbLike});
    } else{
      res.status(200).send({ res: false, like: nbLike });
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
