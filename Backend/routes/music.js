var express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
const fs = require("fs");
const nanoid = require("nanoid");
var router = express.Router();
const { MusicService } = require("../service/music.service");

const musicService = new MusicService();

const upload = multer({ dest: "uploads/" });

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    // Extract data from request:
    const file = req.file;
    const name = req.body.name;
    const genre = req.body.genre;
    const desc = req.body.desc;
    // Upload file to Firebase Storage:
    const bucket = admin.storage().bucket();
    const uniqueFilename = nanoid.nanoid() + "_" + file.originalname;
    const fileUploadResponse = await bucket.upload(file.path, {
      destination: uniqueFilename,
    });

    // Get download URL of uploaded file
    const downloadUrl = await fileUploadResponse[0].getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });

    const musicDoc = await admin.firestore().collection("Music").doc(req.uid).get();
    if (!musicDoc.exists) {
      await admin
        .firestore()
        .collection("Music")
        .doc(req.uid)
        .set({
          URL: downloadUrl,
          name: [name],
          genre: [genre],
          desc: [desc],
        });
    } else {
      admin
        .firestore()
        .collection("Music")
        .doc(req.uid)
        .update({
          URL: admin.firestore.FieldValue.arrayUnion(downloadUrl[0]),
          name: admin.firestore.FieldValue.arrayUnion(name),
          genre: admin.firestore.FieldValue.arrayUnion(genre),
          desc: admin.firestore.FieldValue.arrayUnion(desc),
        });
    }
    await admin.firestore().collection("Liked").doc(name).set({
      idUserLike: [],
      like: 0,
    });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file." + error);
  }
});

router.get("/genre", async (req, res) => {
  const genres = [
    "Pop",
    "Rock",
    "Hip-hop/Rap",
    "Electronic",
    "R&B/Soul",
    "Country",
    "Reggae",
    "Latin",
    "Jazz",
    "Classical",
    "Blues",
    "Funk",
    "Metal",
    "Gospel",
    "Punk",
    "Alternative",
    "World",
    "Folk",
    "Indie",
    "Experimental",
  ];

  const genreObjects = genres.map((genre, index) => ({
    name: genre,
    number: index + 1,
  }));

  res.send({
    genre: genreObjects,
  });
});

router.get("/user/all", authenticate, async (req, res) => {
  admin
    .firestore()
    .collection("Music")
    .doc(req.uid)
    .get()
    .then((doc) => {
      const musique = doc.data();
      InfoSelectedMusique = musique.name;
      const musiqueObjects = InfoSelectedMusique.map((name, index) => ({
        name: name,
        number: index + 1,
      }));
      res.send(musiqueObjects);
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      res.status(500).send("Error fetching user data");
    });
});

router.get("/:userId", authenticate, async (req, res) => {
  const userId = req.params.userId;

  admin
    .firestore()
    .collection("Music")
    .doc(userId)
    .get()
    .then((doc) => {
      const musique = doc.data();
      if (musique !== undefined) {
        InfoSelectedMusique = musique.name;
        const musiqueObjects = InfoSelectedMusique.map((name, index) => ({
          name: name,
          url: musique.URL[index],
          number: index + 1,
        }));
        res.send(musiqueObjects);
      }
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      res.status(500).send("Error fetching user data");
    });
});

router.delete("/user/music/:musicId", authenticate, async (req, res) => {
  const musicId = req.params.musicId;

  try {
    const musicRef = await admin.firestore().collection("Music").doc(req.uid).get();

    // Check if the music entry exists
    if (!musicRef.exists) {
      res.status(404).send("Music entry not found.");
      return;
    }
    const dataMusic = musicRef.data();

    await admin.firestore().collection("Liked").doc(dataMusic["name"][musicId]).delete();

    await admin
      .firestore()
      .collection("Music")
      .doc(req.uid)
      .update({
        URL: admin.firestore.FieldValue.arrayRemove(dataMusic["URL"][musicId]),
        desc: admin.firestore.FieldValue.arrayRemove(dataMusic["desc"][musicId]),
        genre: admin.firestore.FieldValue.arrayRemove(dataMusic["genre"][musicId]),
        name: admin.firestore.FieldValue.arrayRemove(dataMusic["name"][musicId]),
      });

    res.status(200).send();
  } catch (error) {
    console.log("Error deleting music entry:", error);
    res.status(500).send("Error deleting music entry.");
  }
});

module.exports = router;
