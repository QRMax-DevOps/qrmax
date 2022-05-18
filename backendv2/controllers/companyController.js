const asyncHandler = require('express-async-handler');
const companyAccount = require('../models/companyAccountModel');
const store = require('../models/storeModel');
const storeAccount = require('../models/storeAccountModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Register company
// @route   PUT /api/v2/Company/Account
// @access  Public
// @review  Complete
const putCompanyAccount = asyncHandler(async (req, res) => {
  const { company, password} = req.body;
	
  // Check if company exists
  const companyExists = await companyAccount.findOne({ company });

  if (companyExists) {
	res.status(400).json({status:"fail", cause:"Company already exists"});
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
    res.status(201).json({status:"success"});
  } 
  else {
	  res.status(400).json({status:"fail",cause:"Invalid company data"});
	  throw new Error('Invalid company data');
  }
});

// @desc    Log in company
// @route   POST /api/v2/Company/Account
// @access  Public
// @review  Complete
const postCompanyAccount = asyncHandler(async (req, res) => {
  const { company, password } = req.body;
  // Check for user email
  const companyAcct = await companyAccount.findOne({ company });
  

  if (companyAcct && (await pbkdf2(password, companyAcct.salt, 80000, 32).toString('hex')) == companyAcct.password) {
    res.status(200).json({
      status:"success",
      token: generateToken(companyAcct._id),
    });
  } 
  else {
    res.status(400).json({status:"fail", cause:"Invalid login credentials"});
    throw new Error('Failed login');
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
// @review  Complete
const patchCompanyAccount = asyncHandler(async (req, res) => {
  const { fields, values } = req.body;

  const companyAcct = await companyAccount.findById(req.company.id);
  
  if (!companyAcct) {
    res.status(400).json({status:"fail", cause:"Company does not exist"});
    throw new Error('Company Does Not Exist') 
  }

  let legal = true;
  //ensure field is a legal field to operate on
  fields.split(',').forEach((field, i)=>{
    if (!(field == "company" || field == 'password')){
      if (legal)
        res.status(400).json({status:"fail", cause:"Illegal operation on field "+field});
      legal = false; 
    }
  })

  if(legal){
    fields.split(',').forEach(async (field, i)=>{
      if(field == 'company'){
        if (await companyAccount.findOne({company:values.split(',')[i]})) {
	        res.status(400).json({status:"fail", cause:"Company name already in use"});
        }
        else{
          res.status(200).json({status:"success", token: generateToken(companyAcct._id)});
        }

        await companyAccount.findByIdAndUpdate(req.company.id, {$set:{company:values.split(',')[i]}});        
      }
  
      else if(field == 'password'){
        // generate salt
        const salt = uuidv4();
        // hash password
        const hash = pbkdf2 (values.split(',')[i], salt, 80000, 32).toString('hex');
        // store company salt and hash
        await companyAccount.findByIdAndUpdate(req.company.id, {$set:{password:hash, salt:salt}})
        res.status(200).json({status:"success", token: generateToken(companyAcct._id)});
      }
    })
  }
})

// @desc    Delete company
// @route   DELETE /api/v2/Company/Account
// @access  Private
// @review  Complete
const deleteCompanyAccount = asyncHandler(async (req, res) => {
  const companyAcct = await companyAccount.findById(req.company.id);

  // Check for company
  if (!companyAcct) {
    res.status(400).json({status:"fail", cause:"Company not found"})
    throw new Error('Company not found')
  }

  await companyAcct.remove()

  res.status(200).json({ status: "success"})
})

// @desc    Add store
// @route   put /api/v2/Company/Store
// @access  Private
// @review  Complete
const addStore = asyncHandler(async (req, res) => {
  const companyAcct = await companyAccount.findById(req.company.id);
  
  const storeName = req.body.store || req.body.storeName;
  
   // Check for company
  if (!companyAcct) {
	  res.status(400).json({status:"fail", cause:'Company not found'});;
	  throw new Error('Company not found');
  }
  
  if (await store.findOne({store:storeName, company:req.company.id})) {
    res.status(400).json({status:"fail", cause:'Store already exists'});
    throw new Error('Store already exists');
  }
  else {
	  const stores = await store.find({company:req.company.id});
	  const storeCreate = await store.create({
      ID:stores.length+1,
	    store: storeName,
		  company: req.company.id
	  });

	  if (storeCreate) {
	    res.status(201).json({status:"success"});
	  } 
	  else {
		  res.status(400).json({status:"fail", cause:'Invalid store data'});
		  throw new Error('Invalid store data');
	  }
  }
})

// @desc    Get stores
// @route   POST /api/v2/Company/Store
// @access  Private
// @review  Complete
const getStores = asyncHandler(async (req, res) => {
  const stores = await store.find({company:req.company.id}, {_id:0, store:1, ID:1});

  // Check for company
  if (!stores) {
    res.status(401).json({status:"fail", cause:'Issue finding stores'});
    throw new Error('Issue finding stores')
  }

  res.status(200).json({status:"success",stores})
})

// @desc    Delete store
// @route   DELETE /api/v2/Company/Store
// @access  Private
// @review  Complete
const deleteStore = asyncHandler(async (req, res) => {
  const storeName = req.body.store || req.body.storeName;
  const storeToBeDeleted = await store.findOne({store: storeName, company: req.company.id});
  
  // Check for company
  if (!storeToBeDeleted) {
    res.status(401).json({status:"fail",cause:'Issue finding store'});
    throw new Error('Issue finding store')
  }
  var storeNum = storeToBeDeleted.ID;
  storeToBeDeleted.remove({store: storeName, company: req.company.id});

  //lower all greater IDs by 1
  const stores = await store.find({company:req.company.id});
  stores.forEach(async (s)=>{
    console.log(storeNum+" - "+s.ID);
    if (s.ID>storeNum){
      var sNum = s.ID-1
      await store.findByIdAndUpdate(s._id, {$set:{ID:sNum}})
    }
  })

	res.status(200).json({status:"success"});
})

// @desc    Edit store
// @route   PATCH /api/v2/Company/Store
// @access  Private
// @review  Complete
const editStore = asyncHandler(async (req,res) =>{
  const storeName = req.body.store || req.body.storeName;
  req.body.fields.split(',').forEach(async (field, i)=>{
    if (!(field == 'storeName' || field == 'store')){
      //ignore
      res.status(200).json({status:"success", message:"Illegal operations may have lead to some fields not being updated"});
    }
    else{
      const storeToBeUpdated = await store.findOne({store: storeName, company: req.company.id});
      if (!storeToBeUpdated) {
        res.status(401).json({status:"fail", cause:"Issue finding store"});
        //throw new Error('Issue finding store')
      }
      else if (await store.findOne({store:req.body.values.split(',')[i], company:req.company.id})) {
        res.status(400).json({status:"fail", cause:'Store name already in use'});
        //throw new Error('Store already exists');
      }
      else{
        await store.updateOne({store: storeName, company:req.company.id}, {$set:{store:req.body.values.split(',')[i]}});
        res.status(200).json({status:"success"});
      }
    }
  })
})

// @desc    Get all the company account settings
// @route   POST /api/v2/Company/Account/Settings
// @access  Private
// @review  Complete
const postCompanyAccountSettings = asyncHandler(async (req,res) =>{
  const settings = await companyAccount.findById(req.company.id, {_id:0, settings:1});
  if(!settings){
    res.status(401).json({status:"fail",cause:'Issue finding company'});
    throw new Error('Issue finding company');
  }

  res.status(200).json({status:"success",settings});
})

// @desc    Set/patch the company account settings
// @route   PATCH /api/v2/Company/Account/Settings
// @access  Private
// @review  Complete
const patchCompanyAccountSettings = asyncHandler(async (req,res)=>{
  const updatedAccount = companyAccount.findById(req.company.id);
  
  if(!updatedAccount){
    res.status(401).json({status:"fail",cause:'Issue finding company'});
    throw new Error('Issue finding company to update');
  }

  var fields = req.body.fields.split(',');
  var values = req.body.values.split(',');

  fields.forEach(async (field, index)=>{
    await companyAccount.findByIdAndUpdate(req.company.id, {$pull:{settings:{[field]:{$exists:true}}}});
    await companyAccount.findByIdAndUpdate(req.company.id, {$push:{settings:{[field]:values[index]}}});
  })
  
  res.status(200).json({status:"success"});
})

// @desc    Get all store accounts under a company and their attatched stores
// @route   PATCH /api/v2/Company/Account/accountList
// @access  Private
// @review  Complete
const postCompanyAccountList = asyncHandler(async (req,res)=>{
  //get all stores under company
  let storeAccounts = await storeAccount.find({company:req.company.id});
  let Accounts = [];
  for(let i=0; i<storeAccounts.length; i++){
    const storeAccount = storeAccounts[i];
    const username = storeAccount.username;
    let stores = storeAccount.stores;
    for (let j = 0;j<stores.length;j++){
      stores[j] = await store.findById(stores[j]);
      stores[j] = {ID:stores[j].ID, store:stores[j].store};
    }
    Accounts.push({username:username, stores:stores});
  }
  res.status(200).json({status:"success", Accounts});
})


module.exports = {
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
}