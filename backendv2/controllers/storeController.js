const asyncHandler = require('express-async-handler');
const storeAccount = require('../models/storeAccountModel');
const companyAccount = require('../models/companyAccountModel');
const store = require('../models/storeModel');
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
    settings:[],
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
  let valid = ['username', 'password', 'stores'];
  //check all fields are valid
  for(let i=0; i<fields.split(',').length; i++){
    let field = fields.split(',')[i];
    if(!valid.includes(field)){
      res.status(400).json({status:"fail", cause:"Cannot call patch operation on field: "+field});
	    throw new Error('Cannot call patch operation on field');
    }  
    else if (field=='username'){
      if(await storeAccount.findOne({company:company, username:values.split(',')[i]})){
        res.status(400).json({status:"fail", cause:"Username already in use"});
	      throw new Error("Username already in use");
      }
    }
  }

  //if all fields valid then go through and update them accordingly
  for (let i=0; i<fields.split(',').length; i++){
    let field = fields.split(',')[i];
    if(field == 'password'){
      //get new password
      let password = values.split(',')[i];
      // generate salt
      const salt = uuidv4();
      // hash password
      const hash = pbkdf2 (password, salt, 80000, 32).toString('hex');
      //set password
      await storeAccount.updateOne({username:username, company:company}, {$set:{password:hash}})
      res.status(200).json({status:"success"});
    }
    else if (field =='stores'){
      //check all stores exists
      let stores= values.split(',')[i];
      stores = stores.split(';');
      //check all stores exist
      for(let j=0; j<stores.length; j++){
        let s = stores[j];
        if(! await store.findOne({company:req.company.id, store:s})){
          res.status(400).json({status:"fail", cause:"Store not found: "+s});
          throw new Error('Store not found');
        }
      }
      //remove all stores from list
      await storeAccount.updateOne({company:req.company.id, username:username}, {$set:{stores:[]}})
      for(let j=0; j<stores.length; j++){
        let s = stores[j];
        s = await store.findOne({company:req.company.id, store:s})
        //add all stores to storeAccount
        await storeAccount.updateOne({company:req.company.id, username:req.body.username}, {$addToSet:{stores:s._id}});
        //find store object and add storeAccount to the store
        let storeAcct = storeAccount.findOne({company:req.company.id, username:req.body.username});
        let storeAcctID = storeAcct._id;
        await store.updateOne({company:req.company.id, store:s.store}, {$addToSet:{accounts:storeAcctID}});
      }
      res.status(200).json({ status: "success"});
    }
    else{
      await storeAccount.updateOne({username:username, company:company}, {$set:{[field]:values.split(',')[i]}})
      res.status(200).json({status:"success"});
    }
  }
});

// @desc    Delete user
// @route   DELETE /api/v2/Store/Account
// @access  Private
// @review  Complete
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

// @desc    Add stores to user and user to stores
// @route   PUT /api/v2/Store/Account/storesList
// @access  Private
// @review  Complete
const addStoresToAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findOne({company:req.company.id, username:req.body.username});
  // Check storeAccount exists
  let storeAcctID = storeAcct._id;
  if (!storeAcct) {
	  res.status(401).json({stattus:"fail", cause:"Store account not found"});
	  throw new Error('Store account not found');
  }

  //check all stores exists
  req.body.stores.split(',').forEach(async (s)=>{
    if(! await store.findOne({company:req.company.id, store:s})){
      res.status(400).json({status:"fail", cause:"Store not found: "+s});
      throw new Error('Store not found');
    }
  })

  req.body.stores.split(',').forEach(async (s)=>{
    s = await store.findOne({company:req.company.id, store:s})
    //add all stores to storeAccount
    await storeAccount.updateOne({company:req.company.id, username:req.body.username}, {$addToSet:{stores:s._id}});
    //find store object and add storeAccount to the store
    await store.updateOne({company:req.company.id, store:s.store}, {$addToSet:{accounts:storeAcctID}});
  })
  res.status(200).json({ status: "success"});
})

// @desc    Delete stores from account
// @route   DELETE /api/v2/Store/Account/storesList
// @access  Private
// @review  Complete
const deleteStoresFromAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findOne({company:req.company.id, username:req.body.username});
  // Check storeAccount exists
  let storeAcctID = storeAcct._id;
  if (!storeAcct) {
	  res.status(401).json({stattus:"fail", cause:"Store account not found"});
	  throw new Error('Store account not found');
  }
  //check all stores exists
  req.body.stores.split(',').forEach(async (s)=>{
    if(! await store.findOne({company:req.company.id, store:s})){
      res.status(400).json({status:"fail", cause:"Store not found: "+s});
      throw new Error('Store not found');
    }
  })
  req.body.stores.split(',').forEach(async (s)=>{
    s = await store.findOne({company:req.company.id, store:s})
    //add all stores to storeAccount
    await storeAccount.updateOne({company:req.company.id, username:req.body.username}, {$pull:{stores:s._id}});
    //find store object and add storeAccount to the store
    await store.updateOne({company:req.company.id, store:s.store}, {$pull:{accounts:storeAcctID}});
  })
  res.status(200).json({ status: "success"});

})

// @desc    Delete stores from account
// @route   DELETE /api/v2/Store/Account/storesList
// @access  Private
// @review  Underway
const getStoresFromAccount = asyncHandler(async (req,res)=>{
  const storeAcct = await storeAccount.findOne({company:req.company.id, username:req.body.username});
  // Check storeAccount exists
  if (!storeAcct) {
	  res.status(401).json({stattus:"fail", cause:"Store account not found"});
	  throw new Error('Store account not found');
  }
  //get list of stores
  const stores = storeAcct.stores;
  var storeList = [];
  for (let i=0; i<stores.length;i++){
    let s = stores[i]
    let foundStore = await store.findById(s);
    let found = {ID:foundStore.ID, store:foundStore.store}
    storeList.push(found);
  }
  res.status(200).json({status:"success",storeCount:stores.length, stores:storeList});
})

// @desc    Get all the store account settings
// @route   POST /api/v2/Store/Account/Settings
// @access  Private
// @review  Complete
const postStoreAccountSettings = asyncHandler(async (req,res)=>{
  const settings = await storeAccount.findById(req.store.id, {_id:0, settings:1});
  if(!settings){
    res.status(401).json({status:"fail",cause:'Issue finding store'});
    throw new Error('Issue finding store');
  }

  res.status(200).json({status:"success",settings});
})

// @desc    Set/patch the store account settings
// @route   PATCH /api/v2/Store/Account/Settings
// @access  Private
// @review  Complete
const patchStoreAccountSettings = asyncHandler(async (req,res)=>{
  const updatedAccount = await storeAccount.findById(req.store.id);
  console.log(updatedAccount)
  
  if(!updatedAccount){
    res.status(401).json({status:"fail",cause:'Issue finding store'});
    throw new Error('Issue finding store to update');
  }

  var fields = req.body.fields.split(',');
  var values = req.body.values.split(',');

  fields.forEach(async (field, index)=>{
    await storeAccount.findByIdAndUpdate(req.store.id, {$pull:{settings:{[field]:{$exists:true}}}});
    await storeAccount.findByIdAndUpdate(req.store.id, {$push:{settings:{[field]:values[index]}}});
  })
  
  res.status(200).json({status:"success"});
})


module.exports = {
  putStoreAccount,
  postStoreAccount,
  patchStoreAccount,
  deleteStoreAccount,
  addStoresToAccount,
  deleteStoresFromAccount,
  getStoresFromAccount,
  postStoreAccountSettings,
  patchStoreAccountSettings
}