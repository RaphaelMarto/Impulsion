var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");
const { User, Social, Address, RoleToUser, Follow } = require("../models");
const MyError = require("../middleware/Error");
const { authenticate } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  const idToken = req.body.token;
  try {
    // Verify token and get user ID
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const uid = decodedToken.uid;
    const user = await admin.auth().getUser(uid);
    let UserId = "";
    let SocialId = "";
    let AddressId = "";

    // Check if user exists in database
    const userExist = await User.findOne({ where: { UID: uid } });
    if (userExist === null) {
      // User doesn't exist, create new user document
      Social.create().then((social) => {
        SocialId = social.id;
        Address.create().then((adress) => {
          AddressId = adress.id;
          User.create({
            Nickname: user.displayName,
            Email: user.providerData[0].email,
            Password: "InFirebase",
            Phone: null,
            PictureUrl: user.photoURL,
            PolicyCheck: false,
            isActive: true,
            Role: 1,
            idSocials: SocialId,
            AdressId: AddressId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            UID: uid,
          }).then((user) => {
            UserId = user.id;
            RoleToUser.create({
              RoleId: 1,
              UserId: UserId,
            });
          });
        });
      });
    } else {
      UserId = userExist.dataValues.id;
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks in milliseconds
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set session cookie in response
    res.cookie("user_session", JSON.stringify({CookieSes :sessionCookie, ID:UserId, UID:uid}), {
      maxAge: expiresIn,
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
    });
    // res.setHeader(
    //   "Set-Cookie",
    //   "user_session=" +
    //     JSON.stringify({CookieSes :sessionCookie, ID:UserId, UID:uid}) +
    //     "; expires=" +
    //     new Date(Date.now() + expiresIn) +
    //     "; Secure; httpOnly; SameSite=None; Path=/"
    // );
    res.send({ res: true });
  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/logout", function (req, res) {
  res.clearCookie("user_session").send({ res: "cookie cleared" });
  // res.setHeader(
  //   "Set-Cookie",
  //   "user_session='x'; expires=" + new Date(Date.now()) + "; Secure; httpOnly; SameSite=None; Path=/"
  // );
  res.send();
});

router.get("/userId", authenticate, async (req, res) => {
  res.status(200).json(JSON.parse(req.cookies.user_session).UID);
});

router.get("/check-cookie", (req, res) => {
  if (req.cookies.user_session) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

router.get("/all/id", async (req, res) => {
  try {
    const UserIds = await Follow.findAll({
      where: { idUserFollowing: JSON.parse(req.cookies.user_session).ID },
      attributes: ["idUserFollowed"],
      raw: true,
    }).then((followeds) => {
      const followedUserIds = followeds.map((followed) => followed.idUserFollowed);

      return User.findAll({
        where: {
          id: followedUserIds,
        },
        attributes: ["id", "Nickname", "PictureUrl",'UID'],
      });
    });
    if (UserIds.length == 0 || !Array.isArray(UserIds)) throw new MyError("You don't follow anyone", 401);
    res.status(200).json(UserIds);
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message });
  }
});

router.get("/get-name", async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: JSON.parse(req.cookies.user_session).ID }, attributes: ["Nickname"] });
    if (!user) throw new MyError("No User", 404);
    res.status(200).json(user);
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message });
  }
});


module.exports = router;
