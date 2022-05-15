const asyncHandler = require('express-async-handler');
const display = require('../models/displayModel');
const store = require('../models/storeModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Create display
// @route   PUT /api/v2/Display
// @access  Public
// @review  Complete
const putDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.displayName;
  //Check if display exists
  const displayExists = await display.findOne({store:req.store.id, displayName:displayName });
  if (displayExists) {
	  res.status(400).json({status:"fail",cause:"Display already exists"});
	  throw new Error('Display already exists');
  }

  if(!(req.body.displayType&&req.body.location)){
    res.status(400).json({status:"fail",cause:"Missing display information"});
	  throw new Error('Missing display information');
  }

  var displaytype = req.body.displayType;

  if (displaytype != 'static' && displaytype != 'dynamic'){
    res.status(400).json({status:"fail",cause:"Invalid display type"});
	  throw new Error('Invalid display type');
  }

  var location = req.body.location;
  
  const displayCreate = await display.create({
    displayName: displayName,
	  store: req.store.id,
    media:[],
    currentContent:{},
    displayType:displaytype,
    location:location,
    baseMedia:{},
    settings:[],
  });

  if (displayCreate) {
    res.status(201).json({status:"success"});
  } 
  else {
	  res.status(400).json({status:"fail",cause:"Invalid display data"});
	  throw new Error('Invalid display data');
  }
});

// @desc    Get displays
// @route   POST /api/v2/Display
// @access  Public
// @review  Complete
const postDisplay = asyncHandler(async (req, res) => {
  const storeID = req.store.id;
  
  //Check if display exists
  const displays = await display.find({store:storeID}, {_id:0,displayName:1,media:1});
	
  if (!displays) {
	  res.status(400).json({status:"success",cause:"No displays for store"});
	  throw new Error('No displays for store');
  }
  else {
	  res.status(200).json({status:"success",displays});
  }
});

// @desc    Delete display
// @route   DELETE /api/v2/Display
// @access  Public
// @review  Complete
const deleteDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.displayName;
  
  //Check if display exists
  const displayExists = await display.find({store:req.store.id, displayName:displayName});
	
  if (!displayExists) {
	  res.status(400).json({status:"fail",cause:'No displays found'});
	  throw new Error('No displays found');
  }
  
  await display.remove({store:req.store.id, displayName:displayName});
  res.status(200).json({status:"success"});
});

// @desc    Patch display
// @route   PATCH /api/v2/Display
// @access  Public
// @review  Underway
const patchDisplay = asyncHandler(async (req, res) => {
  const { fields, values, displayName } = req.body;

  if(!(fields&&values&&displayName)){
    res.status(400).json({status:"fail", cause:"Missing patch information"});
    throw new Error('Missing patch information') 
  }

  const displayAcct = await display.findOne({store:req.store.id, displayName:displayName});
  
  if (!displayAcct) {
    res.status(400).json({status:"fail", cause:"Display does not exist"});
    throw new Error('Display Does Not Exist') 
  }

  //ensure field is a legal field to operate on
  fields.split(',').forEach((field, i)=>{
    if (!(field == "displayName" || field == 'displayType' || field == 'location')){
      res.status(400).json({status:"fail", cause:"Illegal operation on field "+field});
    }
  })

  fields.split(',').forEach(async (field, i)=>{
    if(field == 'displayName'){
      if (await display.findOne({store:req.store.id, displayName:values.split(',')[i]})) {
	      res.status(400).json({status:"fail", cause:"Display name already in use"});
      }
      else{
        await display.updateOne({store:req.store.id, displayName:displayName}, {$set:{displayName:values.split(',')[i]}});
        res.status(200).json({status:"success"});
      }
              
    }

    else if(field == 'displayType'){
      if (!(values.split(',')[i] == 'static' || values.split(',')[i] == 'dynamic')){
        res.status(400).json({status:"fail", cause:"Illegal display type"});
      }   
    }

    if(!res.headersSent){
      await display.updateOne({store:req.store.id, displayName:displayName}, {$set:{[field]:values.split(',')[i]}});     
      res.status(200).json({status:"success"});
    }
  })
});

module.exports = {
  putDisplay,
  postDisplay,
  patchDisplay,
  deleteDisplay
}