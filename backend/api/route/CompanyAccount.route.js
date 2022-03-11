const express = require("express");
const CompanyAccountController = require("../controller/CompanyAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(CompanyAccountController.login)
    .patch(CompanyAccountController.patch)
    .put(CompanyAccountController.register)
    .delete(CompanyAccountController.delete)

module.exports = router;
