var express = require("express");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
var router = express.Router();

router.post("/:followedUid", authenticate, async (req, res) => {
  try {
    const followedUid  = req.params.followedUid;
    const followingDoc = await admin.firestore().collection("Follow").doc(req.uid).get();
    const followedDoc = await admin.firestore().collection("Follow").doc(followedUid).get();
    if (!followingDoc.exists) {
      await admin
        .firestore()
        .collection("Follow")
        .doc(req.uid)
        .set({
          followed: [],
          following: [followedUid],
        });
    } else {
      await admin
        .firestore()
        .collection("Follow")
        .doc(req.uid)
        .update({
          following: admin.firestore.FieldValue.arrayUnion(followedUid),
        });
    }
    if (!followedDoc.exists) {
      await admin
        .firestore()
        .collection("Follow")
        .doc(followedUid)
        .set({
          followed: [req.uid],
          following: [],
        });
    } else {
      await admin
        .firestore()
        .collection("Follow")
        .doc(followedUid)
        .update({
          followed: admin.firestore.FieldValue.arrayUnion(req.uid),
        });
    }

    res.send({ res: true });
  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/all", authenticate, async (req, res) => {
  admin
    .firestore()
    .collection("Follow")
    .doc(req.uid)
    .get()
    .then((doc) => {
      const follow = doc.data();
      InfoSelectedFollow = follow.following;
      const promises = InfoSelectedFollow.map((uid) => admin.firestore().collection("Utilisateur").doc(uid).get());
      Promise.all(promises)
        .then((snapshot) => {
          const names = snapshot.map((doc) => {return doc.data().Nickname});
          const followObjects = names.map((name, index) => ({
            uid: InfoSelectedFollow[index],
            name: name,
            number: index + 1,
          }));
          res.send(followObjects).status(200)
        })
        .catch((error) => {
          console.log("Error fetching names:", error);
        });
    })
    .catch((error) => {
      res.status(500).send("Error fetching user data");
    });
});

router.get("/:followID", authenticate, async (req, res) => {
  const followedId = req.params.followID;
  admin
    .firestore()
    .collection("Follow")
    .doc(req.uid)
    .get()
    .then((doc) => {
      const follow = doc.data();
      InfoSelectedFollow = follow.following;
      if ( InfoSelectedFollow.indexOf(followedId) !== -1){
        res.status(200).send({res:true})
      }
    })
    .catch((error) => {
      res.status(500).send("Error fetching user data");
    });
});

router.delete("/:followedId", authenticate, async (req, res) => {
  const followedId = req.params.followedId;

  try {
    const followingRef = await admin.firestore().collection("Follow").doc(req.uid).get();
    const followedRef = await admin.firestore().collection("Follow").doc(followedId).get();

    // Check if the music entry exists
    if (!followingRef.exists) {
      res.status(404).send("Follow entry not found.");
      return;
    }
    const dataFollowing = followingRef.data();
    const dataFollowed = followedRef.data();
    
    const indexToRemoveFollowing = dataFollowing.following.indexOf(followedId);
    const indexToRemoveFollowed = dataFollowed.followed.indexOf(req.uid);

    await admin
      .firestore()
      .collection("Follow")
      .doc(req.uid)
      .update({
        following: admin.firestore.FieldValue.arrayRemove(dataFollowing["following"][indexToRemoveFollowing]),
      });

    await admin
      .firestore()
      .collection("Follow")
      .doc(followedId)
      .update({
        followed: admin.firestore.FieldValue.arrayRemove(dataFollowed["followed"][indexToRemoveFollowed]),
      });

    res.status(200).send();
  } catch (error) {
    res.status(500).send("Error deleting entry.");
  }
});

module.exports = router;
