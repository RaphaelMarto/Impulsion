var express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const fs = require("fs");
const nanoid = require('nanoid');
var router = express.Router();
const { MusicService } = require("../service/music.service");

const musicService = new MusicService();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
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

    const musicDoc = await admin.firestore().collection("Music").doc("test").get();
    if (!musicDoc.exists) {
      await admin
        .firestore()
        .collection("Music")
        .doc("test")
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
        .doc("test")
        .update({
          URL: admin.firestore.FieldValue.arrayUnion(downloadUrl[0]),
          name: admin.firestore.FieldValue.arrayUnion(name),
          genre: admin.firestore.FieldValue.arrayUnion(genre),
          desc: admin.firestore.FieldValue.arrayUnion(desc),
        });
    }

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

module.exports = router;
