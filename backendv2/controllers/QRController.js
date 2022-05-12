const asyncHandler = require('express-async-handler')
const UserInput = require('../models/userInputModel')
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");


// @desc    Post User Input
// @route   POST /api/v2/QR
// @access  Public
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
	    } else {
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
