const express = require("express");
const CompanyAccountController = require("../controller/CompanyAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(CompanyAccountController.getSettings)
    .patch(CompanyAccountController.changeSettings)

module.exports = router;
