const express = require("express");
const UserInputController = require("./UserInputController.js");

const router = express.Router();

router
    .route("/")
    .post(UserInputController.apiPostUserInput)

module.exports = router;
