var express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
const fs = require("fs");
const nanoid = require("nanoid");
var router = express.Router();
const axios = require("axios");
const { Music, Comment, Liked, Instrument, InstrumentToUser, User, TypeMusic, TempNewInstrument,sequelize } = require("../models");
const { Op } = require("sequelize");

const upload = multer({ dest: "uploads/" });

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    // Extract data from request:
    const file = req.file;
    const nameTrim = req.body.name.trim();
    const name = nameTrim.charAt(0).toUpperCase() + nameTrim.toLowerCase().slice(1);
    const genre = parseInt(req.body.genre);
    const desc = req.body.desc;
    // Upload file to Firebase Storage:
    const bucket = admin.storage().bucket();
    const uniqueFilename = nanoid.nanoid() + "_" + name;
    const fileUploadResponse = await bucket.upload(file.path, {
      destination: uniqueFilename,
    });

    // Get download URL of uploaded file
    const downloadUrl = await fileUploadResponse[0].getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });

    const newMusic = Music.create({
      FilePath: downloadUrl[0],
      Name: name,
      Description: desc,
      TypeMusicId: genre,
      idUser: req.cookies.user_session[1],
    });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
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
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/genre", async (req, res) => {
  try {
    const Genre = await TypeMusic.findAll({ attributes: ['Name','id']});

    res.status(200).json(Genre);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});


router.get("/user/all", async (req, res) => {
  try {
    const musics = await Music.findAll({
      where: { idUser: req.cookies.user_session[1] },
      attributes: ["id","Name"],
    });

    res.status(200).json(musics);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

async function getRandomIndices(excludedIds) {
  const indices = new Set();

  const allIds = await Music.findAll({ attributes: ['id'], raw: true });
  while (indices.size < 10 && indices.size < allIds.length-excludedIds.length) {
    const randomIndex = Math.floor(Math.random() * allIds.length);
    const randomId = allIds[randomIndex].id;

    if (!excludedIds.includes(randomId)) {
      indices.add(randomId);
    }
  }

  return Array.from(indices);
}

// Function to fetch random music documents based on indices
async function getRandomMusic(indices) {
  const musicDocuments = await Music.findAll({
    attributes: ['id', 'Name', 'FilePath','idUser', 'Description'],
    where: {
      id: {
        [Op.in]: indices,
      },
    },
    include: [
      {
        model: User,
        attributes: ['Nickname'],
      },
    ],
  });

  return musicDocuments.map((music) => ({
    id: music.id,
    Name: music.Name,
    Description: music.Description,
    FilePath: music.FilePath,
    idUser: music.idUser,
    Nickname: music.User.Nickname,
  }));
}

router.get('/random/music', async (req, res) => {
  try {
    const excludedIds = req.query.list;
    const randomIndices = await getRandomIndices(excludedIds);
    const randomMusic = await getRandomMusic(randomIndices);

    res.status(200).json(randomMusic);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.toLowerCase().slice(1);
  try {
    const musics = await Music.findAll({
      where: { Name: { [Op.like]: `${startLetter}%` } },
      attributes: ["Name", "FilePath", "TypeMusicId", "idUser"],
    });

    const userIds = musics.map((music) => music.idUser);
    const typeMusicIds = musics.map((music) => music.TypeMusicId);

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "Nickname"],
    });

    const typeMusics = await TypeMusic.findAll({
      where: { id: typeMusicIds },
      attributes: ["id", "Name"],
    });

    // const [users, typeMusics] = await Promise.all([usersPromise, typeMusicsPromise]);

    const modifiedMusics = musics.map((music, index) => {
      const modifiedName = music.Name;
      const userName = users.find((user) => user.id === music.idUser).Nickname;
      const typeName = typeMusics.find((typeMusic) => typeMusic.id === music.TypeMusicId).Name;
      return {
        Name: modifiedName,
        FilePath: music.FilePath,
        UserName: userName,
        TypeName: typeName,
        idUser: music.idUser,
      };
    });
    res.status(200).json(modifiedMusics);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.post('/instrumentTemp/new', async (req, res) => {
  try {
    await TempNewInstrument.create({
      Name: req.body.name,
      Reference: req.body.reference
    })

    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get('/instrumentTemp', async (req, res) => {
  try {
    const TempInstru = await TempNewInstrument.findAll({attributes:['id','Name','Reference']})

    res.status(200).json(TempInstru);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.post('/instrumentTemp/accepted', async (req, res) => {
  try {
    await Instrument.create({
      Name: req.body.name
    })

    await TempNewInstrument.destroy({
      where: { id: req.body.id },
    });

    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete('/instrumentTemp/:idNewInstru', async (req, res) => {
  try {
    await TempNewInstrument.destroy({ where: { id: req.params.idNewInstru },})

    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/instrument/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.slice(1);

  try {
    const instruments = await Instrument.findAll({
      where: { Name: { [Op.like]: `${startLetter}%` } },
      attributes: ["id", "Name"],
    });

    let instrumentData = {};

    for (const instrument of instruments) {
      const instrumentId = instrument.id;

      const usersWithInstrument = await InstrumentToUser.findAll({
        where: { InstrumentId: instrumentId },
        attributes: ["UserId"],
      });

      const userIds = usersWithInstrument.map((user) => user.UserId);

      const users = await User.findAll({
        where: { id: userIds },
        attributes: ["id", "Nickname", "PictureUrl"],
      });

      instrumentData = {user :users, instrument:instrument.Name};
    }

    res.status(200).json(instrumentData);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const MusicList = await Music.findAll({ where: { idUser: userId }, attribute: ["id","Name", "FilePath"] });
    res.status(200).json(MusicList);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete("/:musicId", authenticate, async (req, res) => {
  const musicId = req.params.musicId;

  try {
    await Music.destroy({
      where: { id: musicId },
    });

    await Comment.destroy({
      where: { idMusic: musicId },
    });

    await Liked.destroy({
      where: { idMusic: musicId },
    });

    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;
