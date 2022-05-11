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
  deleteStore
} = require('../controllers/companyAccountController');
const { protect } = require('../middleware/authCompanyMiddleware');

router.put('/Account/', putCompanyAccount);
router.post('/Account/', postCompanyAccount);
router.patch('/Account/', protect, patchCompanyAccount);
router.delete('/Account/', protect, deleteCompanyAccount);

router.put('/store/', protect, addStore);
router.post('/store/', protect, getStores);
router.patch('/store/', protect, addAccountToStore);
router.delete('/store/', protect, deleteStore);

module.exports = router;
