const { Music } = require("../models");
const fs = require('fs');

class MusicService{

    constructor(){}

    async Create(file) {
    const buffer = fs.readFileSync(file.path);
    const songName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));

    // Insert the binary data into the database
    const result = await Music.create({
      File: buffer,
      SongName: songName,
      Desc: '',
      IdUser: 1,
    });

    // Delete the uploaded file from disk
    fs.unlinkSync(file.path);

    return result;
  }
}

module.exports = { MusicService };