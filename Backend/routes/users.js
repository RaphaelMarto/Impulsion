var express = require("express");
var router = express.Router();
const { authenticate } = require("../middleware/auth");
const admin = require("firebase-admin");
const axios = require("axios");
const config = "https://impulsion-api.site";

router.get("", authenticate, (req, res) => {
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

router.get("/all/:startLetter", async (req, res) => {
  const startLetter = req.params.startLetter.charAt(0).toUpperCase() + req.params.startLetter.slice(1);
  const endLetter = String.fromCharCode(startLetter.charCodeAt(0) + 1);

  try {
    const userRef = admin.firestore().collection("Utilisateur");
    const snapshot = await userRef.where("Nickname", ">=", startLetter).where("Nickname", "<", endLetter).get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      res.status(200).send([]);
      return;
    }

    const userDataList = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const selectData = {
        Nickname: userData.Nickname,
        Country: userData.Country,
        PhotoUrl: config +'/user/proxy-image?url='+userData.PhotoUrl,
        id: doc.id,
      };
      userDataList.push(selectData);
    });

    res.status(200).json(userDataList);
  } catch (error) {
    console.log("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.get("/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url; // The URL of the image to proxy
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


router.get("/:UserId", (req, res) => {
  const userId = req.params.UserId;
  admin
    .firestore()
    .collection("Utilisateur")
    .doc(userId)
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
          Country: userData.Country,
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
  admin
    .firestore()
    .collection("Utilisateur")
    .doc(req.uid)
    .update(updatedUserData)
    .then(() => {
      res.status(200).send({ result: "User data updated successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred while updating the user data");
    });
});

module.exports = router;
