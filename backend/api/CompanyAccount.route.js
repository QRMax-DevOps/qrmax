const express = require("express");
const CompanyAccountController = require("./CompanyAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(CompanyAccountController.login)
    .patch(CompanyAccountController.patch)

module.exports = router;
