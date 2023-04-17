var express = require("express");
const multer = require('multer');
var router = express.Router();
const { Music } = require("../models");
const { MusicService } = require("../service/music.service");

const musicService = new MusicService();

const upload = multer({ dest: 'uploads/' });

router.get("/", async (req, res) => {
  await Music.findAll().then((Music) => {
    res.json(Music);
  });
});

router.post("/",upload.single('audio'), async (req, res) => {
    try {
    const result = await musicService.Create(req.file);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;