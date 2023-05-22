var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");

router.post("/login", async (req, res) => {
  const idToken = req.body.token;
  try {
    // Verify token and get user ID
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken.uid)
    const uid = decodedToken.uid;
    const user = await admin.auth().getUser(uid);
    // Check if user exists in database
    const userDoc = await admin
      .firestore()
      .collection("Utilisateur")
      .doc(uid)
      .get();
    if (!userDoc.exists) {
      // User doesn't exist, create new user document
      await admin.firestore().collection("Utilisateur").doc(uid).set({
        Email: user.providerData[0].email,
        Nickname: user.displayName,
        PhotoUrl: user.photoURL,
        Country: null,
        City: null,
        Role: 1,
        PolicyCheck: true,
        IsActive: true,
        Phone: null,
      });
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks in milliseconds
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Set session cookie in response
    res.cookie("user_session", sessionCookie, {
        maxAge: expiresIn,
        expires: new Date(Date.now() + expiresIn ),
        httpOnly:true,
      });
      res.send({res:true});
  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/logout", function (req, res) {
  res.clearCookie("user_session").send({res:"cookie cleared"});
});

router.get("/check-cookie", (req,res) => {
 if (req.cookies.user_session) {
    res.send(true);
  } else {
    res.send(false);
  }
});

module.exports = router;
