const asyncHandler = require('express-async-handler')
const UserInput = require('../models/userInputModel')
const Display = require('../models/displayModel')
const Media = require('../models/mediaModel')
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");


// @desc    Post User Input
// @route   POST /api/v2/QR
// @access  Public
// @review underway
const postUserInput = asyncHandler(async (req, res) => {
  const windowEmulator = new JSDOM('').window;
  const DOMPurify = createDOMPurify(windowEmulator);
  if (!DOMPurify.isSupported) {
    res.status(400).json({status:"fail",cause:"Sanitisation failed"});
		throw new Error('Sanitisation failed');
  }
  //Sanitisation
  const dirtyIdentifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
	const sanitisedIdentifier = DOMPurify.sanitize(dirtyIdentifier);
  const identifierArray = sanitisedIdentifier.split('');
  let cleanIdentifier = "";
  for (let i = 0; i < identifierArray.length; i++) {
    if (identifierArray[i]!="f" && identifierArray[i]!=":") {
      cleanIdentifier+=identifierArray[i];
    }
  }
	
  const dirtyQRID = req.body.QRID;  
	const QRID = DOMPurify.sanitize(dirtyQRID);
  //adding user input to db
	const userInput = await UserInput.create({
	  QR: QRID,
	  UserIdentifier: cleanIdentifier,
	  imeOfInput: new Date(Date.now())
	});
  //recording interaction in correct media
  var result = await Media.findOne({QRID:QRID});
  let voteCount;
  let lifetimeVotes;
	for(var i = 0; i < result.media.length; i++){
      if(result.media[i].QRID === QRID){
        voteCount = result.media[i].voteCount;
        lifetimeVotes = result.media[i].lifetimeVotes;
      }
	}
  voteCount += 1;
  lifetimeVotes += 1;
  //increment voteCount
  await Media.updateOne({QRID:QRID}, {$set:{voteCount:parseInt(voteCount), lifetimeVotes:parseInt(lifetimeVotes)}});
	
	if (userInput) {
	  res.status(201).json({status:"success"});
	} 
  else {
	  res.status(400);
	  throw new Error('Invalid user data');
  }
	/*
      //Regex
      if (/[a-f0-9]{20}$/i.exec(QRID) && QRID.length == 20) {
        //Validation
        if (await UserInputDAO.validate(company, store, display, QRID) && await UserInputDAO.checkLastVote(cleanIdentifier) && await UserInputDAO.geoLocate(cleanIdentifier)) {
          UserInputDAO.postUserInput(cleanIdentifier, company, store, display, QRID);
          DisplayDAO.addVote(company, store, display, QRID);
	      	res.json({status:"success"});
        }
        else {
          throw "Validation failed";
        }
      }
      else {
        throw "Regex failed";
      }
	*/
});

module.exports = {
	postUserInput
};
