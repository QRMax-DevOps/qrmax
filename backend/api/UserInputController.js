const UserInputDAO = require("../dao/UserInputDAO.js");

class UserInputController {
  static async apiGetUserInput(req, res) {
    try {
      const userIdentifier =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      const tempURL = req.protocol + "://" + req.get("host") + req.originalUrl;
      const URL = tempURL.split(/[/ ]+/).pop();
      const TimeOfInput = Date.now();

      const UserInputResponse = await UserInputDAO.postUserInput(
        userIdentifier,
        URL,
        TimeOfInput
      );
      res.json({ status: "success" });
    } catch (e) {
      res.json({ status: "fail", cause: e });
    }
  }
}

module.exports = UserInputController;