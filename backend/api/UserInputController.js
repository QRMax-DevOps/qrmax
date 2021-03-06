const UserInputDAO = require("../dao/UserInputDAO.js");
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");

class UserInputController {
  static async apiPostUserInput(req, res) {
    //try {
      console.log("hey");
      const windowEmulator = new JSDOM('').window;
      const DOMPurify = createDOMPurify(windowEmulator);
      if (DOMPurify.isSupported) {
        //Sanitisation
        const dirtyIdentifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        const dirtyURL = req.body.qrid;
        const sanitisedIdentifier = DOMPurify.sanitize(dirtyIdentifier);
        const identifierArray = sanitisedIdentifier.split('');
        let cleanIdentifier = "";
        for (let i = 0; i < identifierArray.length; i++) {
          if (identifierArray[i]!="f" && identifierArray[i]!=":") {
            cleanIdentifier+=identifierArray[i];
          }
        }
        const cleanURL = DOMPurify.sanitize(dirtyURL).replace('/api/v1/QR/', '');
        
        //Regex
        if (/[a-f0-9]{20}$/i.exec(cleanURL) && cleanURL.length == 20) {
          //Validation
          if (await UserInputDAO.validate(cleanURL) && await UserInputDAO.checkLastVote(cleanIdentifier) && await UserInputDAO.geoLocate(cleanIdentifier)) {
            const UserInputResponse = await UserInputDAO.postUserInput(cleanIdentifier,cleanURL);
          }
          else {
            throw "Validation failed";
          }
        }
        else {
          throw "Regex failed";
        }
      }
      else {
        throw "Sanitisation failed";
      }

      res.json({ status: "success"});
    /*} catch (e) {
      console.log(e);
      res.json({ status: "fail", cause: e});
    }*/
  }
}

module.exports = UserInputController;
