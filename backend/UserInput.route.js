const express = require("express");
const UserInputController = require("./UserInputController.js");

const router = express.Router();

router
    .route("/QR/")
    .post(UserInputController.apiPostUserInput)

module.exports = router;
