var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();
const crypto = require("crypto");

router.post("/add/:nameMusic", authenticate, async (req, res) => {
  const name = req.params.nameMusic;
  const comment = req.body.comment;
  const path = "/Comment/" + name + "/topCom";
  try {
    const random_uuid = crypto.randomBytes(15).toString("hex");
    const new_com = {
      comment: comment,
      idUser: req.uid,
      createdAt: new Date(),
    };

    await admin
      .firestore()
      .collection(path)
      .doc("com " + random_uuid)
      .set(new_com);

    await admin
      .firestore()
      .collection("Comment")
      .doc(name)
      .update({
        nbCom: admin.firestore.FieldValue.increment(1),
      });
    res.status(200).send();
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.post("/add/reply/:docId", authenticate, async (req, res) => {
  const comment = req.body.comment;
  const docId = req.params.docId;
  const path = req.body.path + "/" + docId + "/reply";

  try {
    const random_uuid = crypto.randomBytes(15).toString("hex");
    const new_com = {
      comment: comment,
      idUser: req.uid,
      createdAt: new Date(),
    };

    await admin
      .firestore()
      .collection(path)
      .doc("com " + random_uuid)
      .set(new_com);

    res.status(200).send();
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.delete("/del/:nameDoc/:nameMusic", authenticate, async (req, res) => {
  const nameDoc = req.params.nameDoc;
  const nameMusic = req.params.nameMusic;
  const path = "/Comment/" + nameMusic + "/topCom";

  try {
    deleteSubcollections(path, nameDoc);
    await admin
      .firestore()
      .collection("Comment")
      .doc(nameMusic)
      .update({
        nbCom: admin.firestore.FieldValue.increment(-1),
      });
    res.send().status(200);
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

async function deleteSubcollections(path, doc) {
  let valid = true;
  docRef = admin.firestore().collection(path).doc(doc);
  do {
    const doc = await docRef.get();

    if (doc.exists) {
      const subcollectionRef = docRef.collection("reply");
      const subcollectionSize = await subcollectionRef.get().then((snapshot) => snapshot.size);

      if (subcollectionSize === 0) {
        // Delete the document if it has no subcollections
        // await subcollectionRef.delete();
        await docRef.delete();
        break;
      } else {
        // Recursively delete the subcollections
        await subcollectionRef.get().then((snapshot) => {
          for (const subdoc of snapshot.docs) {
            deleteSubcollections(subdoc.ref).then(() => (valid = false));
          }
        });
      }
    }
  } while (valid);
}

router.get("/comment/:nameMusic", authenticate, async (req, res) => {
  const path = "/Comment/" + req.params.nameMusic + "/topCom";
  let nameUser = [];
  let docId = [];
  let data = [];
  let paths = [];
  let moreCom = [];
  try {
    const docs = await admin.firestore().collection(path).get();

    for (const doc of docs.docs) {
      const local_data = doc.data();
      data.push(local_data);
      docId.push(doc.id);
      nameUser.push((await admin.firestore().collection("Utilisateur").doc(local_data.idUser).get()).data().Nickname);
      paths.push(path);
      moreCom.push(
        await admin
          .firestore()
          .collection(path)
          .doc(doc.id)
          .collection("reply")
          .get()
          .then((snapshot) => snapshot.size)
      );
    }

    res.status(200).send({ docId: docId, data: data, name: nameUser, path: paths, moreCom: moreCom });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.post("/comment/reply/:docId", authenticate, async (req, res) => {
  const path = req.body.path;
  const docId = req.params.docId;
  let nameUser = [];
  let docIds = [];
  let data = [];
  let paths = [];
  let moreCom = [];
  const newPath = path + "/" + docId + "/reply";

  try {
    const doc = await admin
      .firestore()
      .collection(path)
      .doc(docId)
      .collection("reply")
      .get()
      .then((snapshot) => snapshot.size);

    if (doc > 0) {
      const docs = await admin.firestore().collection(path).doc(docId).collection("reply").get();
      for (const doc of docs.docs) {
        const local_data = doc.data();
        data.push(local_data);
        docIds.push(doc.id);
        paths.push(newPath);
        moreCom.push(
          await admin
          .firestore()
          .collection(newPath)
          .doc(doc.id)
          .collection("reply")
          .get()
          .then((snapshot) => snapshot.size)
        );
        nameUser.push((await admin.firestore().collection("Utilisateur").doc(local_data.idUser).get()).data().Nickname);
      }
    }
    res.status(200).send({ docId: docIds, data: data, name: nameUser, path: paths, moreCom: moreCom });
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
