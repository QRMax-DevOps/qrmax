const express = require('express');
const router = express.Router();
const {
  putStoreAccount,
  postStoreAccount,
  patchStoreAccount,
  deleteStoreAccount,
  addStoresToAccount,
  deleteStoresFromAccount
} = require('../controllers/storeAccountController');
const { protect } = require('../middleware/authStoreMiddleware');

router.put('/', putStoreAccount);
router.post('/', postStoreAccount);
router.patch('/', protect, patchStoreAccount);
router.delete('/', protect, deleteStoreAccount);

router.put('/storesList/', protect, addStoresToAccount);
router.delete('/storesList/', protect, deleteStoresFromAccount);

module.exports = router;
