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

router.post("/add/reply/:docId/:nameMusic", authenticate, async (req, res) => {
  const comment = req.body.comment;
  const docId = req.params.docId;
  const path = req.body.path + "/" + docId + "/reply";
  const name = req.params.nameMusic;

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

router.put("/del/:nameDoc/:nameMusic", authenticate, async (req, res) => {
  const nameDoc = req.params.nameDoc;
  const nameMusic = req.params.nameMusic;
  let completePath = req.body.path;

  try {
    await deleteSubcollections(completePath, nameDoc);
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

async function deleteSubcollections(path ,docId) {
  docRef = admin.firestore().collection(path).doc(docId);
    const doc = await docRef.get();

    if (doc.exists) {
      const subcollectionRef = docRef.collection("reply");
      const subcollectionSize = await subcollectionRef.get().then((snapshot) => snapshot.size);

      if (subcollectionSize === 0) {
        // Delete the document if it has no subcollections
        // await subcollectionRef.delete();
        await docRef.delete();
        return;
      } else {
        // Recursively delete the subcollections
        await docRef.delete();
        let newPath = path + '/'+docId+'/reply'
        await subcollectionRef.get().then(async (snapshot) => {
          for (const subdoc of snapshot.docs) {
            console.log(subdoc.id)
            await deleteSubcollections(newPath, subdoc.id);
          }
        });
      }
    }
}

router.get("/comment/:nameMusic", authenticate, async (req, res) => {
  const path = "/Comment/" + req.params.nameMusic + "/topCom";
  let nameUser = [];
  let pictureUrl = [];
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
      pictureUrl.push((await admin.firestore().collection("Utilisateur").doc(local_data.idUser).get()).data().PhotoUrl)
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

    const combinedData = data.map((item, index) => ({
      data: item,
      createdAt: item.createdAt._seconds * 1000,
      nameUser: nameUser[index],
      pictureUrl: pictureUrl[index],
      docId: docId[index],
      path: paths[index],
      moreCom: moreCom[index]
    }));

    combinedData.sort((a, b) => b.createdAt - a.createdAt);
  
    data = combinedData.map(item => item.data);
    nameUser = combinedData.map(item => item.nameUser);
    pictureUrl = combinedData.map(item => item.pictureUrl);
    docId = combinedData.map(item => item.docId);
    paths = combinedData.map(item => item.path);
    moreCom = combinedData.map(item => item.moreCom);

    res.status(200).send({ docId: docId, data: data, name: nameUser, path: paths, moreCom: moreCom, pictures:pictureUrl });
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.post("/comment/reply/:docId", authenticate, async (req, res) => {
  const path = req.body.path;
  const docId = req.params.docId;
  let nameUser = [];
  let pictureUrl = [];
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
        pictureUrl.push((await admin.firestore().collection("Utilisateur").doc(local_data.idUser).get()).data().PhotoUrl);
      }

      const combinedData = data.map((item, index) => ({
        data: item,
        createdAt: item.createdAt._seconds * 1000,
        nameUser: nameUser[index],
        pictureUrl: pictureUrl[index],
        docId: docIds[index],
        path: paths[index],
        moreCom: moreCom[index]
      }));
  
      combinedData.sort((a, b) => b.createdAt - a.createdAt);
    
      data = combinedData.map(item => item.data);
      nameUser = combinedData.map(item => item.nameUser);
      pictureUrl = combinedData.map(item => item.pictureUrl);
      docIds = combinedData.map(item => item.docId);
      paths = combinedData.map(item => item.path);
      moreCom = combinedData.map(item => item.moreCom);
    }
    res.status(200).send({ docId: docIds, data: data, name: nameUser, path: paths, moreCom: moreCom, pictures:pictureUrl });
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
