const express = require("express");
const UserInputController = require("../controller/UserInputController.js");

const router = express.Router();

router
    .route("/")
    .post(UserInputController.apiPostUserInput)

module.exports = router;
