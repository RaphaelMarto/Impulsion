var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");

router.get("",authenticate, (req, res) => {
  admin
    .auth()
    .getUser(req.uid)
    .then((userRecord) => {
      res.send(userRecord.providerData);
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
});

module.exports = router;
