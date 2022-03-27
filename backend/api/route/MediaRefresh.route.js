const express = require("express");
const QRController = require("../controller/QRController.js");


const router = express.Router();

router
    .route("/")
    .patch(QRController.refreshMedia)

module.exports = router;
