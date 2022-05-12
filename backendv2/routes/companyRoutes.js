const express = require('express');
const router = express.Router();
const {
  putCompanyAccount,
  postCompanyAccount,
  patchCompanyAccount,
  deleteCompanyAccount,
  addStore,
  getStores,
  addAccountToStore,
  deleteStore,
  postCompanyAccountSettings,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authCompanyMiddleware');

//Account
router.put('/Account/', putCompanyAccount);
router.post('/Account/', postCompanyAccount);
router.patch('/Account/', protect, patchCompanyAccount);
router.delete('/Account/', protect, deleteCompanyAccount);

  //settings
  router.post('/Account/Settings', protect, postCompanyAccountSettings);
  //router.patch('/Account/Settings', protect, patchCompanySettings);

  /*accountList
  router.post('/Account/AccountList', protect, postCompanyAccountList);
  */

//store
router.put('/store/', protect, addStore);
router.post('/store/', protect, getStores);
router.patch('/store/', protect, addAccountToStore);
router.delete('/store/', protect, deleteStore);

module.exports = router;
