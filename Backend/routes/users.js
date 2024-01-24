var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const axios = require("axios");
const {
  User,
  Address,
  Instrument,
  City,
  Country,
  InstrumentToUser,
  Social,
  Comment,
  Music,
  Follow,
  Liked,
  InstrumentToUsers,
} = require("../models");
const MyError = require("../middleware/Error");
const { Op } = require("sequelize");

router.get("/info", async (req, res) => {
  try {
    const UserInfo = await User.findOne({
      where: {
        id: JSON.parse(req.cookies.user_session).ID,
      },
      attributes: ["Nickname", "Email", "Phone", "PictureUrl"],
      include: [
        {
          model: Address,
          attributes: ["Street", "HouseNum", "PostCode"],
          include: [
            {
              model: City,
              attributes: ["Name"],
              include: [
                {
                  model: Country,
                  attributes: ["Name"],
                },
              ],
            },
          ],
        },
        {
          model: Social,
          attributes: ["Spotify", "Youtube", "Facebook", "Soundcloud"],
        },
      ],
    });
    const InstrumentUser = await InstrumentToUser.findAll({
      where: { UserId: JSON.parse(req.cookies.user_session).ID },
      attributes: ["InstrumentId"],
      raw: true,
    }).then((Instruments) => {
      const InstrumentIds = Instruments.map((Instrument) => Instrument.InstrumentId);

      return Instrument.findAll({
        where: {
          id: InstrumentIds,
        },
        attributes: ["id","Name"],
      })
    });
    res.status(200).send({ UserInfo: UserInfo, InstrumentUser: InstrumentUser });
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/country", authenticate, async (req, res) => {
  try {
    const country = await Country.findAll({ attributes: ['id','Name']})
    res.status(200).json(country);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/city/:idCountry", authenticate, async (req, res) => {
  try {
    const CountryId = req.params.idCountry;

    const CityId = await City.findAll({
      where: {
        CountryId: CountryId,
      },
      attributes: ['id','Name']
    });
    res.status(200).json(CityId);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/instrument/all", async (req, res) => {
  try {
    const newInstrument = await Instrument.findAll({
      attributes: ['id','Name'],
      
    })
    res.status(200).send(newInstrument);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/instrument/:idInstrument", authenticate, async (req, res) => {
  try {
    const instrumentId = req.params.idInstrument;

    const newInstrument = await InstrumentToUser.create({
      InstrumentId: instrumentId,
      UserId: JSON.parse(req.cookies.user_session).ID,
    });
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete("/instrument/:idInstrument", authenticate, async (req, res) => {
  try {
    const instrumentId = req.params.idInstrument;

    const deletedRows = await InstrumentToUser.destroy({
      where: {
        InstrumentId: instrumentId,
        UserId: JSON.parse(req.cookies.user_session).ID,
      },
    });
    if (deletedRows < 0) throw new MyError("No instrument", 401);
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/location/:city", async (req, res) => {
  const cityId = req.params.city;

  try {
    const address = await Address.findAll({ where : {CityId: cityId}, attributes: ['id']})
    const addressIds = address.map((addres) => addres.id)

    const users = await User.findAll({
      where: {
        idSocials: addressIds,
      },
      attributes: ["Nickname", "PictureUrl", "id"],
      include: [
        {
          model: Address,
          attributes: ["id"],
          include: [
            {
              model: City,
              attributes: ["Name"],
              include: [
                {
                  model: Country,
                  attributes: ["Name"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!users || users.length === 0) throw new MyError("No Users found", 401);
    res.status(200).json(users);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.slice(1);
  const endLetter = String.fromCharCode(startLetter.charCodeAt(0) + 1);

  try {
    const users = await User.findAll({
      where: {
        Nickname: {
          [Op.gte]: startLetter,
          [Op.lt]: endLetter,
        },
      },
      attributes: ["Nickname", "PictureUrl", "id"],
      include: [
        {
          model: Address,
          attributes: ["id"],
          include: [
            {
              model: City,
              attributes: ["Name"],
              include: [
                {
                  model: Country,
                  attributes: ["Name"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!users || users.length === 0) throw new MyError("No Users found", 401);
    res.status(200).json(users);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/condition", async (req, res) => {
  try {
    const PolicyCheck = await User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, attributes: ["PolicyCheck"] });
    res.status(200).json(PolicyCheck);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.put("/condition", authenticate, async (req, res) => {
  try {
    const numOfUpdatedRows = await User.update(
      { PolicyCheck: true }, // Set the new value for PolicyCheck
      { where: { id: JSON.parse(req.cookies.user_session).ID } } // Include returning option to get the updated user
    );
    if (numOfUpdatedRows < 0) throw new MyError("Update failed", 401);
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.get("/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer", // Set the response type to arraybuffer to handle binary data
    });

    // Set the appropriate headers for the image response
    res.set("Content-Type", imageResponse.headers["content-type"]);
    res.set("Content-Length", imageResponse.headers["content-length"]);

    // Send the image data as the response
    res.send(imageResponse.data);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.sendStatus(500);
  }
});

router.get("/:UserId", async (req, res) => {
  const userId = req.params.UserId;
  try {
    const UserInfo = await User.findOne({
      where: { id: userId },
      attributes: ["Nickname", "PictureUrl"],
      include: [
        {
          model: Address,
          attributes: ["id"],
          include: [
            {
              model: City,
              attributes: ["Name"],
              include: [
                {
                  model: Country,
                  attributes: ["Name"],
                },
              ],
            },
          ],
        },
        {
          model: Social,
          attributes: ["Spotify", "Youtube", "Facebook", "Soundcloud"],
        },
      ],
    });
    if (!UserInfo) throw new MyError("User Not Found", 401);
    res.status(200).json(UserInfo);
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.put("", authenticate, async (req, res) => {
  try {
    const numOfUpdatedRows = await User.update(
      {
        Nickname: req.body.nickname,
        Email: req.body.email,
        Phone: req.body.phone,
        PictureUrl: req.body.avatar,
      },
      { where: { id: JSON.parse(req.cookies.user_session).ID } }
    );
    if (numOfUpdatedRows < 0) throw new MyError("Update failed", 401);

    User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, include: [{ model: Address }] }).then(function (user) {
      if (user) {
        return user.Address.update({ CityId: req.body.cityId }).then(function (result) {
          return result;
        });
      } else {
        throw new MyError("No User Found", 404);
      }
    });

    User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, include: [{ model: Social }] }).then(function (user) {
      if (user) {
        return user.Social.update({
          Spotify: req.body.Spotify,
          Youtube: req.body.Youtube,
          Facebook: req.body.Facebook,
          Soundcloud: req.body.Soundcloud,
        }).then(function (result) {
          return result;
        });
      } else {
        throw new MyError("No User Found", 404);
      }
    });
    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

router.delete("", authenticate, async (req, res) => {
  try {
    const numOfUpdatedRows = await User.update(
      {
        Nickname: "Deleted User",
        Email: null,
        Phone: null,
        PictureUrl: null,
        isActive: false,
        PolicyCheck: false,
        Password: null,
        UID: null,
      },
      { where: { id: JSON.parse(req.cookies.user_session).ID } }
    );
    if (numOfUpdatedRows < 0) throw new MyError("Update failed", 401);

    User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, include: [{ model: Address }] }).then(function (user) {
      if (user) {
        return user.Address.update({ CityId: 1, PostCode: null, HouseNum: null, Street: null }).then(function (result) {
          return result;
        });
      } else {
        throw new MyError("No User Found", 404);
      }
    });

    User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, include: [{ model: Social }] }).then(function (user) {
      if (user) {
        return user.Social.update({ Spotify: null, Youtube: null, Facebook: null, Soundcloud: null }).then(function (
          result
        ) {
          return result;
        });
      } else {
        throw new MyError("No User Found", 404);
      }
    });

    await RoleToUser.update(
      {
        RoleId: 1,
      },
      {
        where: { UserId: JSON.parse(req.cookies.user_session).ID },
      }
    );

    const userMusic = await Music.findAll({
      where: { idUser: JSON.parse(req.cookies.user_session).ID },
      attributes: ["id"],
    });

    // Extract music IDs
    const musicIds = userMusic.map((music) => music.id);
    await Music.destroy({
      where: { idUser: JSON.parse(req.cookies.user_session).ID },
    });

    await Comment.destroy({
      where: { idMusic: musicIds },
    });

    await Liked.destroy({
      where: { idMusic: musicIds },
    });

    const userFollow = await Follow.findAll({
      where: {
        [Op.or]: [{ idUserFollowing: JSON.parse(req.cookies.user_session).ID }, { idUserFollowed: JSON.parse(req.cookies.user_session).ID }],
      },
      attributes: ["id"],
    });

    // Extract music IDs
    const FollowIds = userFollow.map((follow) => follow.id);
    await Follow.destroy({
      where: { id: FollowIds },
    });

    await InstrumentToUsers.destroy({
      where: { UserId: JSON.parse(req.cookies.user_session).ID },
    });

    res.status(200).send();
  } catch (e) {
    const status = e.status || 401;
    res.status(status).json({ error: e.message });
  }
});

module.exports = router;
