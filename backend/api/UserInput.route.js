const express = require("express");
const UserInputController = require("./UserInputController.js");

const router = express.Router();

router
    .route("/")
    .get(UserInputController.apiGetUserInput)

module.exports = router;
