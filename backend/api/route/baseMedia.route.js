const express = require("express");
const DisplayController = require("../controller/DisplayController.js");

const router = express.Router();

router
    .route("/")
    .put(DisplayController.newBaseMedia)
    .post(DisplayController.getBaseMedia);

module.exports = router;
