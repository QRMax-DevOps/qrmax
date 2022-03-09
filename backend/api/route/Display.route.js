const express = require("express");
const DisplayController = require("../controller/DisplayController.js");

const router = express.Router();

router
    .route("/")
    .put(DisplayController.add)
    .delete(DisplayController.delete)
    .post(DisplayController.list)

module.exports = router;