const express = require("express");
const StoreAccountController = require("./StoreAccountController.js");

const router = express.Router();

router
    .route("/")
    .post(StoreAccountController.listStores)
    .put(StoreAccountController.addStore)
    .delete(StoreAccountController.deleteStore)

module.exports = router;
