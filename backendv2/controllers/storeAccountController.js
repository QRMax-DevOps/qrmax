const asyncHandler = require('express-async-handler');
const storeAccount = require('../models/storeAccountModel');
const companyAccount = require('../models/companyAccountModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Register store account
// @route   PUT /api/v2/Store/Account
// @access  Public
const putStoreAccount = asyncHandler(async (req, res) => {
  const { company, username, password} = req.body;
	
  // Check if company exists
  const companyCheck = await companyAccount.findOne({ company });

  if (!companyCheck) {
	res.status(400);
	throw new Error('Company does not exists');
  }
  
  //Check if user exists
  const userExists = await storeAccount.findOne({ username });
  if (userExists) {
	res.status(400);
	throw new Error('User already exists');
  }
  
  // generate salt
  const salt = uuidv4();
  // hash password
  const hash = pbkdf2 (password, salt, 80000, 32).toString('hex');

  
  const storeAcct = await storeAccount.create({
    username,
	company: companyCheck.id,
	salt,
    password: hash,
  });

  if (storeAcct) {
    res.status(201).json({
      _id: storeAcct.id,
      company: storeAcct.company,
      salt: storeAcct.salt,
      password: storeAcct.hash,
    });
  } 
  else {
	  res.status(400);
	  throw new Error('Invalid storeAccount data');
  }
});

// @desc    Log in store
// @route   POST /api/v2/Store/Account
// @access  Public
const postStoreAccount = asyncHandler(async (req, res) => {
  const { company, username, password } = req.body;
  
  // Check for user
  const storeAcct = await storeAccount.findOne({ username });
  
  const findCompany = await companyAccount.findOne({ company });

  if (storeAcct && (findCompany.company == company) && (await pbkdf2(password, storeAcct.salt, 80000, 32).toString('hex')) == storeAcct.password) {
    res.json({
      _id: storeAcct.id,
      company: storeAcct.company,
      token: generateToken(storeAcct._id),
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
const patchStoreAccount = asyncHandler(async (req, res) => {
  const { fields, values } = req.body;
  const storeAcct = await storeAccount.findById(req.company.id);
  
  if (storeAcct) {
      const fields = req.body.fields;
      const values = req.body.values;
      const farray = fields.split(',');
      const varray = [];

      let j = 0;
      for (let f of farray) {
          if (f === "stores") {
              let stores;
              stores = values.split('[{');
              stores = stores[1].split('}]');
              stores = stores[0].split('},{');
              varray.push(stores);
          }
          else {
              varray.push(values.split(',')[j]);
              j++;
          }
      }
	  
      let i = -1;
	  let username = storeAcct.username;
	  let user = storeAcct.username;
	  let company = storeAcct.company;
      for (let field of farray) {
        i++;
        let value = varray[i];
        if(field == 'company' || field == 'salt'){
                //dont do anyhting lol just return a success anyway
			res.status(200).json({ status: "success"});
        }
        else if(field == 'username'){
          await storeAccount.updateOne({company:company, username:username}, {$set:{[field]:value}}, {upsert:false});
          user = value;
		  res.status(200).json({ status: "success"});
        }
        else if(field == 'password'){
                // generate salt
          const salt = uuidv4();
                // hash password
          const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store company salt and hash
          await storeAccount.updateOne({company:company, username:user}, {$set:{[field]:hash, salt:salt}}, {upsert:false});
		  res.status(200).json({ status: "success"});
        }
        else if(field === "stores") {
          await storeAccount.updateOne({company:company, username:user}, {$pull:{stores:{}}}, {upsert:false});
          for (let val of values[i]) {
            let temp = val.split(',');
            let temp1 = temp[0].split(':');
            let temp2 = temp[1].split(':');
                
            await storeAccount.updateOne({company:company, username:user}, {$push:{stores:{ID:temp1[1], store:temp2[1]}}});
			res.status(200).json({ status: "success"});
          }
        }
        else{
          await storeAccount.updateOne({company:company, username:user}, {$set:{[field]:value}}, {upsert:false});
		  res.status(200).json({ status: "success"});
        }
      }
  }
  else {
    res.status(400)
    throw new Error('User Account Does Not Exist')
  }
})

// @desc    Delete user
// @route   DELETE /api/v2/Store/Account
// @access  Private
const deleteStoreAccount = asyncHandler(async (req, res) => {
  const storeAcct = await storeAccount.findById(req.company.id);

  // Check for company
  if (!storeAcct) {
	res.status(401);
	throw new Error('Store account not found');
  }

  await storeAcct.remove();

  res.status(200).json({ status: "success"});
})

// @desc    Add stores to user
// @route   PUT /api/v2/Store/Account/storesList
// @access  Private
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