const express = require('express');
const router = express.Router();
const {
  postUserInput,
} = require('../controllers/QRController');

router.post('/', postUserInput);

module.exports = router;
