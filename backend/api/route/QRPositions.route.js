const express = require("express");
const QRController = require("../controller/QRController.js");


const router = express.Router();

router
    .route("/")
    .put(QRController.addPosition)
	.patch(QRController.patch)
	.post(QRController.listPositions)
	.delete(QRController.deletePositions)

module.exports = router;
