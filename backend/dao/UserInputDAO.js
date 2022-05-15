let UserInput;
const axios = require('axios');
const math = require('mathjs');

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
    let apiURL = "https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=" + cleanIdentifier;
    //let apiURL = 'https://api.ipgeolocation.io/ipgeo?apiKey=ebda205e53cf4d409fc755628aa9b19a&ip=101.183.54.116'
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
    let testLat = lat;
    let testLon = lon;
    
    var R = 6371;
    var dLat = (testLat-responseLat) * (math.pi/180);
    var dLon = (testLon-responseLon) * (math.pi/180);
      var a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(responseLat * (math.pi/180)) * math.cos(testLat * (math.pi/180)) * math.sin(dLon/2) * math.sin(dLon/2);
      var c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a));
      var d = R * c; // Distance in km
    
    mobileDataCheck = cleanIdentifier.split(".")
    if (mobileDataCheck[0] < 100) {
      //Mobile data
      if (d<1000) {
        return true;
      }
    }
    else {
      if (d<1) {
        return true;
      }
    }
    return false;
    
  }
}

module.exports = UserInputDAO;
