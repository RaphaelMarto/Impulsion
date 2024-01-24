var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const { Statistic, Music } = require("../models");

router.get("/user", async (req, res) => {
  try {
    const musicData = await Music.findAll({
      where: { idUser: JSON.parse(req.cookies.user_session).ID },
      attributes: ["id", "Name"],
    });

    const musicIds = musicData.map(music => music.id);

    const stats = await Statistic.findAll({
      where: { idMusic: musicIds },
      createdAt: {
        [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // 30 jours en millisecondes
      },
      attributes: ["nbLike", "nbView", "idMusic"],
    });
    
    const totalLikes = stats.reduce((sum, stat) => sum + stat.nbLike, 0);
    const totalViews = stats.reduce((sum, stat) => sum + stat.nbView, 0);

    const averageLikes = totalLikes / stats.length;
    const averageViews = totalViews / stats.length;

    const mostViewedMusic = stats.reduce((acc, stat) => {
      if (!acc || stat.nbView > acc.nbView) {
        return {
          nbView: stat.nbView,
          musicName: musicData.find((music) => music.id === stat.idMusic).Name,
        };
      }
      return acc;
    }, null);

    const mostLikedMusic = stats.reduce((acc, stat) => {
      if (!acc || stat.nbLike > acc.nbLike) {
        return {
          nbLike: stat.nbLike,
          musicName: musicData.find((music) => music.id === stat.idMusic).Name,
        };
      }
      return acc;
    }, null);

    res.status(200).json({
      avgLike: averageLikes,
      avgView: averageViews,
      totLike: totalLikes,
      totView: totalViews,
      mostLike: mostLikedMusic,
      mostView: mostViewedMusic,
    });
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.post("/newStat", async (req, res) => {
  try {
    const idMusic = req.body.idMusic;
    const nbView = req.body.nbView+1;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const stat = await Statistic.findOne({
      where: { idMusic: idMusic },
      createdAt: {
        [Op.gte]: startOfDay,
      },
      attributes: ['id']
    });

    if (!stat) {
      await Statistic.create({
        nbLike: 0,
        nbView: 1,
        idMusic: idMusic,
      });
    } else {
      await Statistic.update(
        {
          nbView: nbView,
          idMusic: idMusic,
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

router.get("/view/:idMusic", async (req, res) => {
  try {
    const idMusic = req.params.idMusic;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const nbView = await Statistic.findOne({
      where: { idMusic: idMusic },
      createdAt: {
        [Op.gte]: startOfDay,
      },
      attributes: ['nbView']
    });

    res.status(200).json(nbView);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;