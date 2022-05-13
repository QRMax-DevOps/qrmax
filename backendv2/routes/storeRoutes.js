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
const companyProtect = require('../middleware/authCompanyMiddleware');
const compantStoreProtect = require('../middleware/authCompanyStoreMiddleware');

//company protect used as a store account can only be created by a valid logged in Company account
router.put('/Account/', companyProtect.protect, putStoreAccount); //done
router.post('/Account/', postStoreAccount); //done
router.patch('/Account/', compantStoreProtect.protect, patchStoreAccount); //doing: needs to be accessed by both logged in store AND logged in company
router.delete('/Account/', companyProtect.protect, deleteStoreAccount); //doing: same problem as above

  //StoresList
  router.put('/Account/storesList/', companyProtect.protect, addStoresToAccount);
  router.delete('/Account/storesList/', companyProtect.protect, deleteStoresFromAccount);
  //router.post('/Account/storesList/', protect, getStoresFromAccount);

  /*Settings
  route.post('/Account/Settings/', protect, postStoreAccountSettings);
  route.patch('/Account/Settings/', protect, patchStoreAccountSettings);
  */


module.exports = router;
