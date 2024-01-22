var express = require("express");
const { authenticate } = require("../middleware/auth");
var router = express.Router();
const { Liked,Statistic } = require("../models");
const { Op } = require("sequelize");
const MyError = require("../middleware/Error");

router.get("/add/:idMusic", authenticate, async (req, res) => {
  try {
    const idMusic = req.params.idMusic;
    const like = await Liked.create({
      idMusic: idMusic,
      idUser: req.cookies.user_session[1],
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const stat = await Statistic.findOne({
      where: { idMusic: idMusic },
      createdAt: {
        [Op.gte]: startOfDay,
      },
      attribute: ['nbLike']
    });

    if(stat){
      await Statistic.update(
        {
          nbLike: ++stat.nbLike,
          updatedAt: new Date(),
        },
        { where: { idMusic: idMusic } }
      );
    }
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete("/del/:idMusic", authenticate, async (req, res) => {
  try {
    const idMusic = req.params.idMusic;
    const deletedRows = await Liked.destroy({
      where: {
        idMusic: idMusic,
        idUser: req.cookies.user_session[1],
      },
    });
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const stat = await Statistic.findOne({
      where: { idMusic: idMusic },
      createdAt: {
        [Op.gte]: startOfDay,
      },
      attribute: ['nbLike']
    });

    if(stat){
      await Statistic.update(
        {
          nbLike: --stat.nbLike,
          updatedAt: new Date(),
        },
        { where: { idMusic: idMusic } }
      );
    }
    if (deletedRows < 0) throw new MyError("No like", 401);
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/liked/:idMusic", async (req, res) => {
  const idMusic = isNaN(req.params.idMusic) ? false : parseInt(req.params.idMusic, 10);

  try {
    if(idMusic === false){
      throw new MyError('Wrong params',401)
    }
    const numberOfLikes = await Liked.count({ where: { idMusic: idMusic } });
    let likedEntry = null;

    if (req.cookies.user_session) {
      likedEntry = await Liked.findOne({ where: { idUser: req.cookies.user_session[1], idMusic: idMusic } });
    }

    const isLiked = !!likedEntry;
    res.status(200).send({numberOfLikes : numberOfLikes,isLiked: isLiked});
    
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;
