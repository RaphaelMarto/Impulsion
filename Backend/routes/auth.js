var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");

router.post("/login", async (req, res) => {
  const idToken = req.body.token;
  try {
    // Verify token and get user ID
    const decodedToken = await admin.auth().verifyIdToken(idToken);
  
    const uid = decodedToken.uid;
    const user = await admin.auth().getUser(uid);
    // Check if user exists in database
    const userDoc = await admin.firestore().collection("Utilisateur").doc(uid).get();
    if (!userDoc.exists) {
      // User doesn't exist, create new user document
      await admin.firestore().collection("Utilisateur").doc(uid).set({
        Email: user.providerData[0].email,
        Nickname: user.displayName,
        PhotoUrl: user.photoURL,
        Instrument: [],
        Country:null,
        City: null,
        Role: 1,
        PolicyCheck: false,
        IsActive: true,
        Phone: null,
      });
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks in milliseconds
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set session cookie in response
    res.cookie("user_session", sessionCookie, {
      maxAge: expiresIn,
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
    });
    // res.setHeader(
    //   "Set-Cookie",
    //   "user_session=" +
    //     sessionCookie +
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

router.get("/check-cookie", (req, res) => {
  if (req.cookies.user_session) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get("/get-name", authenticate, (req, res) => {
  admin
    .firestore()
    .collection("Utilisateur")
    .doc(req.uid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        // No document found for the given UID
        res.status(404).send("Document not found");
      } else {
        // Retrieve the data from the document
        const userData = doc.data();
        const selectData = {
          Nickname: userData.Nickname
        };
        res.send(selectData);
      }
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      res.status(500).send("Error fetching user data");
    });
});


module.exports = router;
