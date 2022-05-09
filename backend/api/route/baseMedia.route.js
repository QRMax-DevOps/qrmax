const express = require("express");
const DisplayController = require("../controller/DisplayController.js");

const router = express.Router();

router
    .route("/")
    .post(DisplayController.newBaseMedia)
    .get(DisplayController.getBaseMedia);

module.exports = router;
