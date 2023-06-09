var express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
const fs = require("fs");
const nanoid = require("nanoid");
var router = express.Router();
const axios = require("axios");
const { MusicService } = require("../service/music.service");

const musicService = new MusicService();
const config = "https://impulsion-api.site";

const upload = multer({ dest: "uploads/" });

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    // Extract data from request:
    const file = req.file;
    const name = req.body.name.trim();
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
    let nameArray = musicDoc.get("name");
    let genreArray = musicDoc.get("genre");
    let descArray = musicDoc.get("desc");

    nameArray.push(name);
    genreArray.push(genre);
    descArray.push(desc);

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
          name: nameArray,
          genre: genreArray,
          desc: descArray,
        });
    }
    await admin.firestore().collection("Liked").doc(name).set({
      idUserLike: [],
      like: 0,
    });

    await admin.firestore().collection("Comment").doc(name).set({
      idUserCom: [],
      nbCom: 0,
      Comment:[],
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

router.get("/proxy-audio", async (req, res) => {
  try {
    const url = req.query.url; // The URL of the audio file to proxy
    const audioResponse = await axios.get(url, {
      responseType: "arraybuffer", // Set the response type to arraybuffer to handle binary data
    });

    // Set the appropriate headers for the audio response
    res.set("Content-Type", audioResponse.headers["content-type"]);
    res.set("Content-Length", audioResponse.headers["content-length"]);

    // Send the audio data as the response
    res.send(audioResponse.data);
  } catch (error) {
    console.error("Error proxying audio:", error);
    res.sendStatus(500);
  }
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

// Function to generate an array of random indices
function getRandomIndices(totalDocuments, count) {
  const indices = [];
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * totalDocuments);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}

async function verify(querySnapshot, list, indices) {
  let getMore = "";
  let emptyId = [];
  let newIndice = [];
  querySnapshot.map(async (querySnapshot, index) => {
    const doc = querySnapshot.docs[0];
    const data = doc.data().URL;
    if (data == []) {
      emptyId.push(doc.id);
      getMore++;
      return;
    }

    if (!emptyId.includes(doc.id)) {
      if (list !== [] && list.includes(doc.id)) {
        if (data.length > 1) {
          const target = doc.id;
          let count = 0;

          for (let i = 0; i < list.length; i++) {
            if (list[i] === target) {
              count++;
            }
          }

          if (data.length <= count) {
            indices.splice(index, 1);
            emptyId.push(doc.id);
            getMore++;
          }
          else{
            newIndice.push(indices[index]);
          }
        } else {
          indices.splice(index, 1);
          emptyId.push(doc.id);
          getMore++;
        }
      } else {
        newIndice.push(indices[index]);
      }
    }
  });
  return [getMore, emptyId, newIndice];
}

// Function to fetch the random documents based on the generated indices
async function getRandomDocsSnapshot(collectionRef, indices, list, totalDocuments) {
  const promises = indices.map((index) => {
    return collectionRef.limit(1).offset(index).get();
  });
  let querySnapshots = await Promise.all(promises);

  let more = await verify(querySnapshots, list, indices);

  let getMore = more == undefined ? 0 : more[0];
  let emptyId = more == undefined ? [] : more[1];

  if (more !== undefined) {
    indices = more[2];
  }

  if (getMore !== 0) {
    let newIndice = getRandomIndices(totalDocuments, getMore);
    indices.concat(newIndice);
    if (indices.length == 10) {
      const promises = indices.map((index) => {
        return collectionRef.limit(1).offset(index).get();
      });
      querySnapshots = await Promise.all(promises);
    }
  }

  const musicDocuments = querySnapshots.map((querySnapshot) => {
    const doc = querySnapshot.docs[0];
    const data = doc.data().URL;
    let count= 0;
    if (!emptyId.includes(doc.id)) {
      if (list !== [] && list.includes(doc.id)) {
        if (data.length > 1) {
          const target = doc.id;
          count = 0;

          for (let i = 0; i < list.length; i++) {
            if (list[i] === target) {
              count++;
            }
          }
        }
        return {
          url: doc.data().URL[count],
          titre: doc.data().name[count],
          id: doc.id,
        };
      }
      return {
        url: doc.data().URL[0],
        titre: doc.data().name[0],
        id: doc.id,
      };
    }
  });
  filteredMusic = musicDocuments.filter((music) => music !== undefined);
  return filteredMusic;
}

router.get("/all/music", async (req, res) => {
  try {
    const strList = req.query.list;
    const list = strList.split(",");
    const musicCollectionRef = admin.firestore().collection("Music");
    const totalDocuments = await musicCollectionRef.get().then((snapshot) => snapshot.size);
    const numberToGet = totalDocuments >= 10 ? 10 : totalDocuments;
    const randomIndices = getRandomIndices(totalDocuments, numberToGet);
    const docsData = await getRandomDocsSnapshot(musicCollectionRef, randomIndices, list, totalDocuments);
    res.status(200).json(docsData);
  } catch (error) {
    console.error("Error retrieving random music documents:", error);
    res.status(500).send("Internal Server Error Music");
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

router.get("/instruments", async (req, res) => {
  const instruments = [
    "Trombone",
    "Saxophone",
    "Trumpet",
    "Tuba",
    "French horn",
    "Clarinet",
    "Harp",
    "Xylophone",
    "Maracas",
    "Bell",
    "Harmonica",
    "Accordion",
    "Bass drum",
    "Banjo",
    "Double bass",
    "Cello",
    "Violin",
    "Piano",
    "Guitar",
    "Bass guitar",
    "Conga",
    "Snare drum",
    "Drums/ Drum set",
    "DJ controller",
    "Digital piano",
    "singer",
    "Synthesizer",
    "Sampler",
  ];

  const sortedInstrument = instruments.sort();

  res.send({
    instruments: sortedInstrument,
  });
});

router.get("/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.slice(1);
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

  try {
    const userRef = admin.firestore().collection("Music");
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      res.status(200).send([]);
      return;
    }

    const musicDataList = [];
    for (const doc of snapshot.docs) {
      const musicData = doc.data();
      let nameUser = "";

      try {
        const nameUserDoc = await admin.firestore().collection("Utilisateur").doc(doc.id).get();
        const userData = nameUserDoc.data();
        nameUser = userData.Nickname;

        const matchingPositions = musicData.name
          .map((name, index) => (name.startsWith(startLetter) ? index : -1))
          .filter((index) => index !== -1);

        if (matchingPositions.length > 0) {
          for (let i = 0; i < matchingPositions.length; i++) {
            const selectData = {
              Url: musicData.URL[matchingPositions[i]],
              Genre: genres[musicData.genre[matchingPositions[i]] - 1],
              Name: musicData.name[matchingPositions[i]],
              Nickname: nameUser,
              id: doc.id,
            };
            musicDataList.push(selectData);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
      }
    }

    res.status(200).json(musicDataList);
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/instrument/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.slice(1);

  try {
    const userRef = admin.firestore().collection("Utilisateur");
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      res.status(200).send([]);
      return;
    }

    const userDataList = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const matchingPositions = userData.Instrument.map((instrument, index) =>
        instrument.startsWith(startLetter) ? index : -1
      ).filter((index) => index !== -1);

      if (matchingPositions.length > 0) {
        const selectData = {
          Nickname: userData.Nickname,
          Instrument: userData.Instrument,
          PhotoUrl: config + "/user/proxy-image?url=" + userData.PhotoUrl,
          id: doc.id,
        };
        userDataList.push(selectData);
      }
    });

    res.status(200).json(userDataList);
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/:userId", async (req, res) => {
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
    await admin.firestore().collection("Comment").doc(dataMusic["name"][musicId]).delete();

    let nameArray = musicRef.get("name");
    let genreArray = musicRef.get("genre");
    let descArray = musicRef.get("desc");

    nameArray.splice(musicId, 1);
    genreArray.splice(musicId, 1);
    descArray.splice(musicId, 1);

    await admin
      .firestore()
      .collection("Music")
      .doc(req.uid)
      .update({
        URL: admin.firestore.FieldValue.arrayRemove(dataMusic["URL"][musicId]),
        desc:  descArray,
        genre:  genreArray,
        name: nameArray,
      });

    res.status(200).send();
  } catch (error) {
    console.log("Error deleting music entry:", error);
    res.status(500).send("Error deleting music entry.");
  }
});

module.exports = router;
