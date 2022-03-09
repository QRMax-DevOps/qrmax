const DisplayDAO = require("./DisplayDAO");
let UserInput;

class UserInputDAO {
  static async injectDB(conn) {
    if (UserInput) {
      return;
    }
    try {
      UserInput = await conn.db(process.env.QRMAX_NS).collection("UserInput");
    } catch (e) {
      console.error(
        'unable to establish a collection handle in UserInputDAO" ${e}'
      );
    }
  }

  static async postUserInput(UserIdentifier, company, store, display, QRID){
    try{
      const UserInputDoc = {
        UserIdentifier: UserIdentifier,
        URL: URL,
		TimeOfInput: new Date(Date.now())
      }
	  DisplayDAO.addVote(company, store, display, QRID);
      return await UserInput.insertOne(UserInputDoc)
    }
    catch(e){
      res.json({ status: "fail", cause: e });
    }
  }

  static async validate(company, display, store, QRID) {
    if (DisplayDAO.checkQR(company, store, display, QRID)) {
	  return true;
	}
    else {
console.log("QR doesnt exist");
	  return false;
	}
  }

  static async checkLastVote(cleanIdentifier) {
    try {
      if (await UserInput.countDocuments({"UserIdentifier": {$eq: cleanIdentifier}})>0) {
        return false;
      }
      else {
        return true;
      }
    } 
    catch(e) {
      res.json({ status: "fail", cause: e });
      return false;
    }
    return true;
  }

  static async geoLocate(cleanIdentifier) {
    return true; //stub
  }
  
}

module.exports = UserInputDAO;
