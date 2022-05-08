const express = require('express');
const router = express.Router();
const {
  postUserInput,
} = require('../controllers/userInputController');

router.post('/', postUserInput);

module.exports = router;
