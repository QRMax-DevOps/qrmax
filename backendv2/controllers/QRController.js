const asyncHandler = require('express-async-handler')
const UserInput = require('../models/userInputModel')
const Display = require('../models/displayModel')
const Media = require('../models/mediaModel')
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");
const axios = require('axios');
const math = require('mathjs');


// @desc    Post User Input
// @route   POST /api/v2/QR
// @access  Public
// @review underway
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
    console.log(cleanIdentifier);

    const dirtyQRID = req.body.QRID;
    const QRID = DOMPurify.sanitize(dirtyQRID);
    console.log(QRID);

    const company = req.body.company;
    const store = req.body.store;
    const display = req.body.display;
    
    /*Need More Validation Here*/

    //let apiURL = "https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=" + cleanIdentifier;
    //WIFI TEST
    let apiURL = 'https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=101.183.54.116'
    //MOBILE DATA TEST
    //let apiURL = 'https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=1.145.60.15'
    let responseLat;
    let responseLon;
    await axios.get(apiURL)
        .then((res) => {
            console.log(`Status: ${res.status}`);
            //console.log('Body: ', res.data);
        responseLat = parseFloat(res.data.latitude);
        responseLon = parseFloat(res.data.longitude);
        //console.log(responseLat);
        //console.log(responseLon);
        }).catch((err) => {
            console.error(err);
        });
      
    //-37.80981, 144.96984 - success
    //-37.835030, 144.953620 - fail
    let testLat = -37.80981;
    let testLon = 144.96984;
    
    var R = 6371;
    var dLat = (testLat-responseLat) * (math.pi/180);
    var dLon = (testLon-responseLon) * (math.pi/180);
      var a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(responseLat * (math.pi/180)) * math.cos(testLat * (math.pi/180)) * math.sin(dLon/2) * math.sin(dLon/2);
      var c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a));
      var d = R * c; // Distance in km
    
    mobileDataCheck = cleanIdentifier.split(".")
    if (mobileDataCheck[0] < 100) {
      //Mobile data
      if (d>1000) {
        res.status(400);
        throw new Error('Out of range');
      }
    }
    else {
      if (d>1) {
        res.status(400);
        throw new Error('Out of range');
      }
    }
    
    const userInput = await UserInput.create({
      QR: QRID,
      UserIdentifier: cleanIdentifier,
      TimeOfInput: new Date(Date.now())
    });

    if (userInput) {
      res.status(201).json({
        _id: userInput.id,
        QR: userInput.QR,
        UserIdentifier: userInput.UserIdentifier,
        TimeOfInput: userInput.TimeOfInput
      });
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
  }
  else {
    res.status(400);
    throw new Error('Sanitisation failed');
  }
});

module.exports = {
	postUserInput
};
