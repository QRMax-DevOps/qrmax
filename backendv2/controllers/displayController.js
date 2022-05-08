const asyncHandler = require('express-async-handler');
const display = require('../models/displayModel');
const store = require('../models/storeModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');

// @desc    Create display
// @route   PUT /api/v2/Display
// @access  Public
const putDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.displayName;
  const storeID = req.body.store;
  
	
  // Check if store exists
  const storeFind = await store.findOne({ storeID });

  if (!storeFind || storeID != storeFind.id) {
	res.status(400);
	throw new Error('Store does not exists');
  }
  
  //Check if display exists
  const displayExists = await display.findOne({ displayName });
  if (displayExists) {
	res.status(400);
	throw new Error('Display already exists');
  }
  
  const displayCreate = await display.create({
    displayName,
	store: storeID,
  });

  if (displayCreate) {
    res.status(201).json({
      _id: displayCreate.id,
      displayName: displayCreate.displayName,
      store: displayCreate.store
    });
  } 
  else {
	  res.status(400);
	  throw new Error('Invalid display data');
  }
});

// @desc    Get displays
// @route   POST /api/v2/Display
// @access  Public
const postDisplay = asyncHandler(async (req, res) => {
  const storeID = req.body.store;
  
  //Check if display exists
  const displayExists = await display.find({ store:storeID });
	
  if (!displayExists) {
	res.status(400);
	throw new Error('No displays for store');
  }
  else {
	  res.status(200).json(displayExists);
  }
});

/*
// @desc    Patch display
// @route   POST /api/v2/Display
// @access  Public
const postDisplay = asyncHandler(async (req, res) => {
  const storeID = req.body.store;
  
  //Check if display exists
  const displayExists = await display.find({ store:storeID });
	
  if (!displayExists) {
	res.status(400);
	throw new Error('No displays for store');
  }
  else {
	  res.status(200).json(displayExists);
  }
});
*/

// @desc    Delete display
// @route   DELETE /api/v2/Display
// @access  Public
const deleteDisplay = asyncHandler(async (req, res) => {
  const displayID = req.body.display;
  
  //Check if display exists
  const displayExists = await display.find({ _id: displayID });
	
  if (!displayExists) {
	res.status(400);
	throw new Error('No displays found');
  }
  
  await display.remove({ _id: displayID });
  res.status(200).json("success");
});

module.exports = {
  putDisplay,
  postDisplay,
  //patchDisplay,
  deleteDisplay
}