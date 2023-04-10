var express = require("express");
var router = express.Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
  await User.findAll().then((user) => {
    res.json(user);
  });
});

module.exports = router;
