const express = require('express');
const router = express.Router();
const {
  putCompanyAccount,
  postCompanyAccount,
  patchCompanyAccount,
  deleteCompanyAccount,
  addStore,
  getStores,
  editStore,
  deleteStore,
  postCompanyAccountSettings,
  patchCompanyAccountSettings,
  postCompanyAccountList
} = require('../controllers/companyController');
const { protect } = require('../middleware/authCompanyMiddleware');

//Account
router.put('/Account/', putCompanyAccount); //done
router.post('/Account/', postCompanyAccount); //done
router.patch('/Account/', protect, patchCompanyAccount); //done
router.delete('/Account/', protect, deleteCompanyAccount); //done

  //settings
  router.post('/Account/Settings', protect, postCompanyAccountSettings); //done
  router.patch('/Account/Settings', protect, patchCompanyAccountSettings); //done

  //accountList
  router.post('/Account/AccountList', protect, postCompanyAccountList);

//store
router.put('/store/', protect, addStore); //done
router.post('/store/', protect, getStores); //done
router.patch('/store/', protect, editStore); //done
router.delete('/store/', protect, deleteStore); //done

module.exports = router;
