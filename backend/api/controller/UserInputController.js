const UserInputDAO = require("../../dao/UserInputDAO.js");
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");

class UserInputController {
  static async apiPostUserInput(req, res) {
    try {
      const windowEmulator = new JSDOM('').window;
      const DOMPurify = createDOMPurify(windowEmulator);
      if (DOMPurify.isSupported) {
        //Sanitisation
        const dirtyIdentifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        const dirtyQRID = req.body.QRID;
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
        const sanitisedIdentifier = DOMPurify.sanitize(dirtyIdentifier);
        const identifierArray = sanitisedIdentifier.split('');
        let cleanIdentifier = "";
        for (let i = 0; i < identifierArray.length; i++) {
          if (identifierArray[i]!="f" && identifierArray[i]!=":") {
            cleanIdentifier+=identifierArray[i];
          }
        }
        const QRID = DOMPurify.sanitize(dirtyQRID);
        //Regex
        if (/[a-f0-9]{20}$/i.exec(QRID) && QRID.length == 20) {
          //Validation
          if (await UserInputDAO.validate(company, store, display, QRID) && await UserInputDAO.checkLastVote(cleanIdentifier) && await UserInputDAO.geoLocate(cleanIdentifier)) {
            UserInputDAO.postUserInput(cleanIdentifier, company, store, display, QRID);
			res.json({status:"success"});
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
    } catch (e) {
      res.json({ status: "fail", cause: e});
    }
  }
}

module.exports = UserInputController;
