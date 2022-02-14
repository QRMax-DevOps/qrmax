const express = require("express");
const CompanyAccountController = require("./CompanyAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(CompanyAccountController.login)
    .put(CompanyAccountController.register)
    .patch(CompanyAccountController.patch)
    .delete(CompanyAccountController.delete)

module.exports = router;
