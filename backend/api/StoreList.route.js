const express = require("express");
const StoreAccountController = require("./StoreAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(StoreAccountController.list)

module.exports = router;
