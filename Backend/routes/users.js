var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");

router.get("", authenticate, (req, res) => {
   admin.firestore()
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
          Nickname: userData.Nickname,
          Email: userData.Email,
          Phone: userData.Phone,
          Country: userData.Country,
          City: userData.City,
          PhotoUrl: userData.PhotoUrl,
        };
        res.send(selectData);
      }
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      res.status(500).send("Error fetching user data");
    });
});

router.put("", authenticate, (req, res) => {
  const updatedUserData = {
    Nickname: req.body.nickname,
    Email: req.body.email,
    Phone: req.body.phone,
    Country: req.body.country,
    City: req.body.city,
    PhotoUrl: req.body.avatar,
  };
  admin.firestore()
    .collection("Utilisateur")
    .doc(req.uid)
    .update(updatedUserData)
    .then(() => {
      res.status(200).send({result : "User data updated successfully"});
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred while updating the user data");
    });
});

module.exports = router;
