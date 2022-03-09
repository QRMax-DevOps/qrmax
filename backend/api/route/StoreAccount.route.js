const express = require("express");
const StoreAccountController = require("../controller/StoreAccountController.js");

const router = express.Router();

router
    .route("/")
    .put(StoreAccountController.register)
    .post(StoreAccountController.login)
    .patch(StoreAccountController.patch)
    .delete(StoreAccountController.delete)

module.exports = router;
