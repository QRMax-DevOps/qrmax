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
        QRID: QRID,
		    TimeOfInput: new Date(Date.now())
      }
      return await UserInput.insertOne(UserInputDoc)
    }
    catch(e){
      res.json({ status: "fail", cause: e });
    }
  }

  static async getVoteStats(time, QRID){
    //for all user input where timeOfInput > current time - time
    let result = await UserInput.find({QRID:QRID, TimeOfInput:{$gt:time}}).toArray();
    let count = 0;
    for(let i = 0; i<result.length;i++){
      count++;
    } 
    console.log(count);
    return count;
    //return count
  }

  static async clearAllVotes(){
    UserInput.deleteMany();
  }

  static async validate(company, display, store, QRID) {
    return true;
    if (DisplayDAO.checkQR(company, store, display, QRID)) {
	  return true;
	}
    else {
console.log("QR doesnt exist");
	  return false;
	}
  }

  static async checkLastVote(cleanIdentifier) {
    return true;
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
