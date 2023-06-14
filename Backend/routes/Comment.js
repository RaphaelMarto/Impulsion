var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();

router.put("/add/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const comment = req.body.comment;
  try {
    let numCom = (await admin.firestore().collection("Comment").doc(name).get()).data().nbCom;

    admin
      .firestore()
      .collection("Comment")
      .doc(name)
      .update({
        idUserCom: admin.firestore.FieldValue.arrayUnion(req.uid),
        Comment: admin.firestore.FieldValue.arrayUnion(comment),
        nbCom: ++numCom,
      });
    res.status(200).send();
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.delete("/del/:nameMusic/:comNum", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const indexPos = req.params.comNum;

  try {
    const comInfo = (await admin.firestore().collection("Comment").doc(name).get()).data();
    let numCom = comInfo.nbCom;

    admin
      .firestore()
      .collection("Comment")
      .doc(name)
      .update({
        idUserCom: admin.firestore.FieldValue.arrayRemove(comInfo.idUserCom[indexPos]),
        Comment: admin.firestore.FieldValue.arrayRemove(comInfo.Comment[indexPos]),
        nbCom: --numCom,
      });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/comment/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  let nameUser = [];
  try {
    const userCom = (await admin.firestore().collection("Comment").doc(name).get()).data().idUserCom;
    const comment = (await admin.firestore().collection("Comment").doc(name).get()).data().Comment;
  
    for( user of userCom){
        nameUser.push((await admin.firestore().collection("Utilisateur").doc(user).get()).data().Nickname)
    }

    res.status(200).send({ nameUserCom: nameUser, comment : comment });
    
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/comment/anon/:nameMusic", async (req, res) => {
  const name = req.params.nameMusic;
  try {
    let nbCom = (await admin.firestore().collection("Comment").doc(name).get()).data().nbCom;

    res.status(200).send({nbCom: nbCom, name: name });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
