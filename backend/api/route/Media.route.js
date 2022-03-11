const express = require("express");
const QRController = require("../controller/QRController.js");

const router = express.Router();

router
    .route("/")
    .post(QRController.getMedia)
    
module.exports = router;