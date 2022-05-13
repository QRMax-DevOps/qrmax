const asyncHandler = require('express-async-handler');
const storeAccount = require('../models/storeAccountModel');
const companyAccount = require('../models/companyAccountModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Register store account
// @route   PUT /api/v2/Store/Account
// @access  Public
// @review  Complete
const putStoreAccount = asyncHandler(async (req, res) => {
  const {username, password} = req.body;

  //check company exists
  if (!await companyAccount.findById(req.company.id )) {
	  res.status(400).json({status:"fail", cause:"Company does not exist"});
	  throw new Error('Company does not exists');
  }
  
  //Check if user exists
  if (await storeAccount.findOne({company:req.company.id, username:username })) {
	  res.status(400).json({status:"fail",cause:"Username already in use"});
	  throw new Error('User already exists');
  }
  
  // generate salt
  const salt = uuidv4();
  // hash password
  const hash = pbkdf2 (password, salt, 80000, 32).toString('hex');

  
  const storeAcct = await storeAccount.create({
    username:username,
	  company: req.company.id,
	  salt:salt,
    password: hash,
  });

  if (storeAcct) {
    res.status(201).json({status:"success"});
  } 
  else {
	  res.status(400).json({status:"fail",cause:"invalid store account data"});
	  throw new Error('Invalid storeAccount data');
  }
});

// @desc    Log in store
// @route   POST /api/v2/Store/Account
// @access  Public
// @review  Complete
const postStoreAccount = asyncHandler(async (req, res) => {
  const { company, username, password } = req.body;
  
  // Check for user
  const storeAcct = await storeAccount.findOne({ username });
  
  const findCompany = await companyAccount.findOne({ company });

  if (storeAcct && (findCompany.company == company) && (await pbkdf2(password, storeAcct.salt, 80000, 32).toString('hex')) == storeAcct.password) {
    res.json({
      status:"success",
      token: generateToken(storeAcct._id),
    });
  } 
  else {
    res.status(400).json({status:"fail",cause:"Invalid credentials"})
    throw new Error('Invalid credentials')
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Update Store Account
// @route   PATCH /api/v2/Store/Account
// @access  Private
// @review  Complete
const patchStoreAccount = asyncHandler(async (req, res) => {
  //get username, fields and body
  const {fields, values} = req.body;
  const username = req.body.username;
  var company;
  var companyCheck
  if(req.company){
    company = req.company.id;
    companyCheck = companyAccount.findById(company);
  }
  else{
    company = req.body.company; 
    companyCheck = companyAccount.findOne({company:company});
  }
  console.log(company);
  //check company exists
  if (!companyCheck){
	  res.status(400).json({status:"fail", cause:"Company does not exist"});
	  throw new Error('Company does not exists');
  }
  //check if the username is valid
  if (!await storeAccount.findOne({ username })){
	  res.status(400).json({status:"fail", cause:"User does not exist"});
	  throw new Error('User does not exists');
  }
  //define a list of allowed fields to patch
  let valid = ['username', 'password'];
  //check all fields are valid
  fields.split(',').forEach(async (field, i)=>{
    if(!valid.includes(field)){
      res.status(400).json({status:"fail", cause:"Cannot call patch operation on field: "+field});
	    throw new Error('Cannot call patch operation on field');
    }  
    if (field=='username'){
      if(await storeAccount.findOne({company:company, username:values.split(',')[i]})){
        res.status(400).json({status:"fail", cause:"Username already in use"});
	      throw new Error("Username already in use");
      }
    }
  })
  //if all fields valid then go through and update them accordingly
  fields.split(',').forEach(async (field, i)=>{
    if(field == 'password'){
      // generate salt
      const salt = uuidv4();
      // hash password
      const hash = pbkdf2 (password, salt, 80000, 32).toString('hex');
      //set password
      await storeAccount.updateOne({username:username, company:company}, {$set:{password:hash}})
      res.status(200).json({status:"success"});
    }
    else{
      await storeAccount.updateOne({username:username, company:company}, {$set:{[field]:values.split(',')[i]}})
      res.status(200).json({status:"success"});
    }
  });
})

// @desc    Delete user
// @route   DELETE /api/v2/Store/Account
// @access  Private
// @review  Done
const deleteStoreAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findOne({company:req.company.id, username:req.body.username});

  // Check for company
  if (!storeAcct) {
    res.status(401).json({status:"fail",cause:'Store account not found'});
	  throw new Error('Store account not found');
  }

  await storeAcct.remove();

  res.status(200).json({ status: "success"});
})

// @desc    Add stores to user
// @route   PUT /api/v2/Store/Account/storesList
// @access  Private
// @review  Underway
const addStoresToAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findById(req.company.id);
  const company = storeAcct.company;
  const username = storeAcct.username;
  let stores = req.body.stores.split(',');
  // Check for company
  if (!storeAcct) {
	res.status(401);
	throw new Error('Store account not found');
  }

  await storeAccount.updateOne({company:company, username:username}, {$set:{stores:stores}}, {upsert:false});
  const updatedStoreAcct = await storeAccount.findById(req.company.id);
  res.status(200).json(updatedStoreAcct);
})

// @desc    Delete stores from account
// @route   DELETE /api/v2/Store/Account/storesList
// @access  Private
const deleteStoresFromAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findById(req.company.id);
  const company = storeAcct.company;
  const username = storeAcct.username;
  // Check for company
  if (!storeAcct) {
	res.status(401);
	throw new Error('Store account not found');
  }

  await storeAccount.updateOne({company:company, username:username}, {$pull:{stores:{}}}, {upsert:false});
  const updatedStoreAcct = await storeAccount.findById(req.company.id);
  res.status(200).json(updatedStoreAcct);
})

module.exports = {
  putStoreAccount,
  postStoreAccount,
  patchStoreAccount,
  deleteStoreAccount,
  addStoresToAccount,
  deleteStoresFromAccount
}