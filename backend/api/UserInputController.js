const UserInputDAO = require("../dao/UserInputDAO.js");
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const e = require("express");

class UserInputController {
  static async apiGetUserInput(req, res) {
    try {
      const windowEmulator = new JSDOM('').window;
      const DOMPurify = createDOMPurify(windowEmulator);
      if (DOMPurify.isSupported) {
        /*Sanitisation*/
        const dirtyIdentifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        const dirtyURL = req.originalUrl;
        const dirtyTimeOfInput = Date.now();
        const cleanIdentifier = DOMPurify.sanitize(dirtyIdentifier);
        const cleanURL = DOMPurify.sanitize(dirtyURL).replace('/', '');
        const cleanTimeOfInput = DOMPurify.sanitize(dirtyTimeOfInput);
        
        /*Regex*/
        if (/[a-f0-9]{20}$/i.exec(cleanURL) && cleanURL.length == 20) {
          const UserInputResponse = await UserInputDAO.postUserInput(
            cleanIdentifier,
            cleanURL,
            cleanTimeOfInput
          );
        }
        else {
          throw "Regex failed";
        }
      }
      else {
        throw "Sanitisation failed";
      }

      res.json({ status: "success" });
    } catch (e) {
      res.json({ status: "fail", cause: e });
    }
  }
}

module.exports = UserInputController;