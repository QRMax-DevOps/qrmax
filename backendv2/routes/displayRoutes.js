const express = require('express');
const router = express.Router();
const {
  putDisplay,
  postDisplay,
  //patchDisplay,
  deleteDisplay
} = require('../controllers/displayController');
const { protect } = require('../middleware/authStoreMiddleware');

router.put('/', protect, putDisplay);
router.post('/', protect, postDisplay);
//router.patch('/', protect, patchDisplay);
router.delete('/', protect, deleteDisplay);

module.exports = router;
