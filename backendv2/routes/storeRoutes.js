const express = require('express');
const router = express.Router();
const {
  putStoreAccount,
  postStoreAccount,
  patchStoreAccount,
  deleteStoreAccount,
  addStoresToAccount,
  deleteStoresFromAccount
} = require('../controllers/storeController');
const { protect } = require('../middleware/authStoreMiddleware');
const { route } = require('./QRRoutes');

router.put('/Account/', putStoreAccount);
router.post('/Account/', postStoreAccount);
router.patch('/Account/', protect, patchStoreAccount);
router.delete('/Account/', protect, deleteStoreAccount);

  //StoresList
  router.put('/Account/storesList/', protect, addStoresToAccount);
  router.delete('/Account/storesList/', protect, deleteStoresFromAccount);
  //router.post('/Account/storesList/', protect, getStoresFromAccount);

  /*Settings
  route.post('/Account/Settings/', protect, postStoreAccountSettings);
  route.patch('/Account/Settings/', protect, patchStoreAccountSettings);
  */


module.exports = router;
