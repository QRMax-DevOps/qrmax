const express = require("express");
const StoreController = require("./StoreController.js");

const router = express.Router();

router
    .route("/")
    .post(StoreController.list)
    .put(StoreController.register)
    .patch(StoreController.patch)
    .delete(StoreController.delete)

module.exports = router;