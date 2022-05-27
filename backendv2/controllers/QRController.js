const asyncHandler = require('express-async-handler')
const UserInput = require('../models/userInputModel')
const Display = require('../models/displayModel')
const Media = require('../models/mediaModel')
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const axios = require('axios');
const math = require('mathjs');


// @desc    Post User Input
// @route   POST /api/v2/QR
// @access  Public
// @review  Not started
const postUserInput = asyncHandler(async (req, res) => {
  const windowEmulator = new JSDOM('').window;
  const DOMPurify = createDOMPurify(windowEmulator);
  if (DOMPurify.isSupported) {
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
  

    let apiURL = "https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=" + cleanIdentifier;
    let responseLat;
    let responseLon;
    await axios.get(apiURL)
        .then((res) => {
        responseLat = parseFloat(res.data.latitude);
        responseLon = parseFloat(res.data.longitude);
        }).catch((err) => {
            console.error(err);
        });
      
    var result = await Media.findOne({QRID:QRID});
    if (!result) {
      res.status(400).json({status:"fail", cause:"Invalid QR"});
      throw new Error('Invalid QR');
    }
    let displayID = result.display;
    var findDisplay = await Display.findById(displayID);
    if (!result) {
      res.status(400).json({status:"fail", cause:"Could not find display"});
      throw new Error('Could not find display');
    }
    let testLat = findDisplay.lat;
    let testLon = findDisplay.lon;
    
    var R = 6371;
    var dLat = (testLat-responseLat) * (math.pi/180);
    var dLon = (testLon-responseLon) * (math.pi/180);
    var a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(responseLat * (math.pi/180)) * math.cos(testLat * (math.pi/180)) * math.sin(dLon/2) * math.sin(dLon/2);
    var c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a));
    //re-enable d when turning location check back on
    // eslint-disable-next-line no-unused-vars
    var d = R * c; // Distance in km
    
    mobileDataCheck = cleanIdentifier.split(".")
    if (mobileDataCheck[0] < 100) {
      //Mobile data
      if (false) {
        res.status(400).json({status:"fail", cause:"Out of range"});
        throw new Error('Out of range');
      }
    }
    else {
      if (false) {
        res.status(400).json({status:"fail", cause:"Out of range"});
        throw new Error('Out of range');
      }
    }
	
	const previousInputs = await UserInput.find({UserIdentifier:cleanIdentifier});
	const currentDate = new Date(Date.now());
	
	for (let i=0; i < previousInputs.length; i++) {
		if (math.abs(previousInputs[i].TimeOfInput - currentDate) < 10000) {
          res.status(400).json({status:"fail", cause:"Tried voting too quickly, wait 10 seconds between votes"});
          throw new Error('Tried voting too quickly, wait 10 seconds between votes');
		}
	}
    
    const userInput = await UserInput.create({
      QR: QRID,
      UserIdentifier: cleanIdentifier,
      TimeOfInput: new Date(Date.now())
    });

    if (userInput) {
      res.status(201).json({status:"success"});
    } 
    else {
      res.status(400).json({status:"fail", cause:"failed user log"});
      throw new Error('Invalid user data');
    }

    //recording interaction in correct media
    result = await Media.findOne({QRID:QRID});
    if(!result){
      res.status(404).json({status:"fail", cause:"Could not find matching media"})
      throw new Error('Could not find matching media');
    }
    let voteCount = result.voteCount +1;
    let lifetimeVotes = result.lifetimeVotes +1;
    //increment voteCount
    await Media.updateOne({QRID:QRID}, {$set:{voteCount:parseInt(voteCount), lifetimeVotes:parseInt(lifetimeVotes)}});
  }
  else {
    res.status(400);
    throw new Error('Sanitisation failed');
  }
});

module.exports = {
	postUserInput
};
