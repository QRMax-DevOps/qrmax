const express = require('express');
const router = express.Router();
const {
  putStoreAccount,
  postStoreAccount,
  patchStoreAccount,
  deleteStoreAccount,
  addStoresToAccount,
  deleteStoresFromAccount,
  getStoresFromAccount,
  postStoreAccountSettings,
  patchStoreAccountSettings
} = require('../controllers/storeController');
const { protect } = require('../middleware/authStoreMiddleware');
const companyProtect = require('../middleware/authCompanyMiddleware');
const companyStoreProtect = require('../middleware/authCompanyStoreMiddleware');

//company protect used as a store account can only be created by a valid logged in Company account
router.put('/Account/', companyProtect.protect, putStoreAccount); //done
router.post('/Account/', postStoreAccount); //done
router.patch('/Account/', companyStoreProtect.protect, patchStoreAccount); //done
router.delete('/Account/', companyProtect.protect, deleteStoreAccount); //done

  //StoresList
  router.put('/Account/storesList/', companyProtect.protect, addStoresToAccount); //done
  router.delete('/Account/storesList/', companyProtect.protect, deleteStoresFromAccount); //done
  router.post('/Account/storesList/', companyProtect.protect, getStoresFromAccount); //done

  //Settings
  router.post('/Account/Settings/', protect, postStoreAccountSettings); //done
  router.patch('/Account/Settings/', protect, patchStoreAccountSettings); //done


module.exports = router;
