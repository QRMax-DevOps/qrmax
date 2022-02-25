const express = require("express");
const QRController = require("../controller/QRController.js");

const router = express.Router();

router
    .route("/")
    .put(QRController.add)
    .delete(QRController.delete)
    .post(QRController.list)
	.patch(QRController.patch)


module.exports = router;