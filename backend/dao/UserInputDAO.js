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

  static async postUserInput(UserIdentifier, URL, TimeOfInput){
    try{
      const UserInputDoc = {
        UserIdentifier: UserIdentifier,
        URL: URL,
        TimeOfInput: TimeOfInput
      }
      return await UserInput.insertOne(UserInputDoc)
    }
    catch(e){
      console.error('unable to post User Input:' + e)
    }
  }

  static async validate(cleanURL) {
    return true; //stub
  }

  static async checkLastVote(cleanIdentifier) {
    try {
      //console.log(await UserInput.countDocuments({"UserIdentifier": {$eq: cleanIdentifier}}));
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
  }

  static async geoLocate(cleanIdentifier) {
    return true; //stub
  }
  
}

module.exports = UserInputDAO;
