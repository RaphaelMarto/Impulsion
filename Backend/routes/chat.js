var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
const crypto = require("crypto");
const config = "https://impulsion-api.site";

router.post("/chatRoom", authenticate, async (req, res) => {
  const idOther = req.body.otherId;

  const room = await admin.firestore().collection("ChatRoom").get();
  let roomExist = false;
  const uuid = crypto.randomBytes(15).toString("hex");

  if (room.empty) {
    await admin
      .firestore()
      .collection("ChatRoom")
      .doc(uuid)
      .set({
        type: "private",
        members: [req.uid, idOther],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    res.send({ id: uuid });
  }

  for (const doc of room.docs) {
    const roomData = doc.data();
    roomExist = roomData.members.includes(req.uid) && roomData.members.includes(idOther);
    if (roomExist) {
      res.send({ id: doc.id });
      break;
    }
  }

  if (!roomExist) {
    await admin
      .firestore()
      .collection("ChatRoom")
      .doc(uuid)
      .set({
        type: "private",
        members: [req.uid, idOther],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    res.send({ id: uuid });
  }
});

router.get("/chatRoom", authenticate, async (req, res) => {
  const room = await admin.firestore().collection("ChatRoom").get();
  let selectData = [];

  for (const doc of room.docs) {
    const roomData = doc.data();

    if (roomData.members.includes(req.uid)) {
      const user_data = roomData.members.filter((x) => x != req.uid);
      const userId = user_data[0];
      const roomsId = doc.id;

      await admin
        .firestore()
        .collection("Utilisateur")
        .doc(userId)
        .get()
        .then(async (doc) => {
          const userData = doc.data();
          data = {
            Nickname: userData.Nickname,
            PhotoUrl: config + "/user/proxy-image?url=" + userData.PhotoUrl,
          };
          const mergedData = Object.assign(data, { roomsId });
          const latestRoomMessage = await admin
            .firestore()
            .collection("ChatRoom/" + roomsId + "/chat")
            .get();

          const sortedChatDocuments = latestRoomMessage.docs.sort((a, b) => b.data().createdAt - a.data().createdAt);
          const lastMessage = sortedChatDocuments[0].data();

          const mergedDataComplete = Object.assign(mergedData, lastMessage);
          selectData.push(mergedDataComplete);
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
          res.status(500).send("Error fetching user data");
        });
    }
  }

  res.send({ user: selectData }).status(200);
});

router.post("/message", authenticate, async (req, res) => {
  const msg = req.body.message;
  const roomId = req.body.roomId;

  const new_msg = {
    message: msg,
    sender: req.uid,
    createdAt: new Date(),
  };

  const random_uuid = crypto.randomBytes(15).toString("hex");
  const room = await admin
    .firestore()
    .collection("ChatRoom/" + roomId + "/chat")
    .doc(random_uuid)
    .set(new_msg);

  res.send().status(200);
});

router.get("/message/:roomId", authenticate, async (req, res) => {
  const roomId = req.params.roomId;
  let roomData = [];

  const room = await admin
    .firestore()
    .collection("ChatRoom/" + roomId + "/chat")
    //.get();

  const query = await room.orderBy('createdAt').get() // .limit(25)

  // const sortedChatDocuments = room.docs.sort((a, b) => a.data().createdAt - b.data().createdAt);
  for (const doc of query.docs) {
    roomData.push(doc.data());
  }
  res.send(roomData).status(200);
});

router.get("/message/latest/:roomId", authenticate, async (req, res) => {
  const roomId = req.params.roomId;
  const room = await admin
    .firestore()
    .collection("ChatRoom/" + roomId + "/chat")
    .get();

  const sortedChatDocuments = room.docs.sort((a, b) => b.data().createdAt - a.data().createdAt);
  // const lastMessage = sortedChatDocuments[0].data()
  res.send().status(200);
});

module.exports = router;
