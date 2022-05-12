const asyncHandler = require('express-async-handler');
const companyAccount = require('../models/companyAccountModel');
const store = require('../models/storeModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Register company
// @route   PUT /api/v2/Company/Account
// @access  Public
const putCompanyAccount = asyncHandler(async (req, res) => {
  const { company, password} = req.body;
	
  // Check if company exists
  const companyExists = await companyAccount.findOne({ company });

  if (companyExists) {
	res.status(400);
	throw new Error('Company already exists');
  }
  
  // generate salt
  const salt = uuidv4();
  // hash password
  const hash = pbkdf2 (password, salt, 80000, 32).toString('hex');

  
  const companyAcct = await companyAccount.create({
    company,
	salt,
    password: hash,
  });

  if (companyAcct) {
    res.status(201).json({
      _id: companyAcct.id,
      company: companyAcct.company,
      salt: companyAcct.salt,
      password: companyAcct.hash,
    });
  } 
  else {
	  res.status(400);
	  throw new Error('Invalid company data');
  }
});

// @desc    Log in company
// @route   POST /api/v2/Company/Account
// @access  Public
const postCompanyAccount = asyncHandler(async (req, res) => {
  const { company, password } = req.body;
  // Check for user email
  const companyAcct = await companyAccount.findOne({ company });
  

  if (companyAcct && (await pbkdf2(password, companyAcct.salt, 80000, 32).toString('hex')) == companyAcct.password) {
    res.json({
      _id: companyAcct.id,
      company: companyAcct.company,
      token: generateToken(companyAcct._id),
    });
  } 
  else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Update Company
// @route   PATCH /api/v2/Company/Account
// @access  Private
const patchCompanyAccount = asyncHandler(async (req, res) => {
  const { fields, values } = req.body;
  const companyAcct = await companyAccount.findById(req.company.id);
  
  if (companyAcct) {
      const farray = fields.split(',');
      const varray = values.split(',');
	  
      let i = -1;
      
      for (let field of farray){
          i++;
          const value = varray[i];
          if(field === 'company'){
              await companyAccount.updateOne({company:companyAcct.company}, {$set:{company:value}}, {upsert:false});
		      res.json({status:"success"});
          }
          else if(field === 'password'){
              // generate salt
              const salt = uuidv4();
              // hash password
              const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
              // store company salt and hash
              await companyAccount.updateOne({company:companyAcct.company}, {$set:{[field]:hash, salt:salt}}, {upsert:false})
		      res.json({status:"success"});
          }
          else{
              await companyAccount.updateOne({company:companyAcct.company}, {$set:{[field]:value}}, {upsert:false})
		      res.json({status:"success"});
          }
      }
  }
  else {
    res.status(400)
    throw new Error('Company Does Not Exist')
  }
})

// @desc    Delete company
// @route   DELETE /api/v2/Company/Account
// @access  Private
const deleteCompanyAccount = asyncHandler(async (req, res) => {
  const companyAcct = await companyAccount.findById(req.company.id);

  // Check for company
  if (!companyAcct) {
    res.status(401)
    throw new Error('Company not found')
  }

  await companyAcct.remove()

  res.status(200).json({ status: "success"})
})

// @desc    Add store
// @route   put /api/v2/Company/Store
// @access  Private
const addStore = asyncHandler(async (req, res) => {
  const companyAcct = await companyAccount.findById(req.company.id);
  
  const storeName = req.body.store;
  
  const findStore = await store.findOne({ storeName });
  // Check for company
  if (!companyAcct) {
	res.status(401);
	throw new Error('Company not found');
  }
  
  if (findStore && (findStore.company == companyAcct.company)) {
    res.status(401)
    throw new Error('Store already exists')
  }
  else {
	  
	  const storeCreate = await store.create({
	    store: storeName,
		company: req.company.id
	  });

	  if (storeCreate) {
	    res.status(201).json({
	      _id: storeCreate.id,
		  store: storeCreate.store,
	      company: storeCreate.company
	    });
	  } 
	  else {
		  res.status(400);
		  throw new Error('Invalid store data');
	  }
  }
})

// @desc    Get stores
// @route   POST /api/v2/Company/Store
// @access  Private
const getStores = asyncHandler(async (req, res) => {
  const stores = await store.find({company: req.company.id});

  // Check for company
  if (!stores) {
    res.status(401)
    throw new Error('Issue finding stores')
  }

  res.status(200).json({stores})
})

// @desc    Add account to store
// @route   PATCH /api/v2/Company/Store
// @access  Private
const addAccountToStore = asyncHandler(async (req, res) => {
  const storeName = req.body.store;
  const storeToBeUpdated = await store.findOne({store: storeName, company: req.company.id});
  
  // Check for company
  if (!storeToBeUpdated) {
    res.status(401)
    throw new Error('Issue finding store')
  }
  else {
	const accountToBeAdded = req.body.account;
  	await storeToBeUpdated.updateOne({store: storeName, company: req.company.id}, {$push:{accounts:{account:accountToBeAdded}}});
  }

  res.status(200).json("success");
})

// @desc    Add account to store
// @route   DELETE /api/v2/Company/Store
// @access  Private
const deleteStore = asyncHandler(async (req, res) => {
  const storeName = req.body.store;
  const storeToBeDeleted = await store.findOne({store: storeName, company: req.company.id});
  
  // Check for company
  if (!storeToBeDeleted) {
    res.status(401)
    throw new Error('Issue finding store')
  }
  else {
  	await storeToBeDeleted.remove({store: storeName, company: req.company.id});
	res.status(200).json("success");
  }

  
})

// @desc    Get  all the company account settings
// @route   POST /api/v2/Company/Account/Settings
// @access  Private
const postCompanyAccountSettings = asyncHandler(async (req,res) =>{
  const settings = await companyAccount.find({company: req.company.id}, {projection:{settings:1}});

  if(!settings){
    res.status(401)
    throw new Error('Issue finding company');
  }

  res.status(200).json({settings});
})


module.exports = {
  putCompanyAccount,
  postCompanyAccount,
  patchCompanyAccount,
  deleteCompanyAccount,
  addStore,
  getStores,
  addAccountToStore,
  deleteStore,
  postCompanyAccountSettings,
}