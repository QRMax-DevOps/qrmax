const { v4: uuidv4 } = require('uuid');
const CompanyDAO = require('./CompanyDAO');
let Display;

class DisplayDAO {
    static async injectDB(conn) {
        if (Display) {
          return;
        }
        try {
            Display = await conn.db(process.env.QRMAX_NS).collection("Display");
        } catch (e) {
          console.error(
            'unable to establish a collection handle in DisplayDAO" ${e}'
          );
        }
    }

    static async checkDisplay(company, store, display){
      const result = await Display.findOne({company:company, store:store, display:display});
      if(result){
        return true;
      }
      return false;
    }

    static async newDisplay(company, store, display, addDisplay){
      //generate display id
      const id = uuidv4();
      //generate document
      const registerDoc = {
        displayID: id, //useless rn but will come in handy post rework
        company: company, //gross
        store: store, //gross
        display:display, //gross
        mediaCount:0,
        media:[]
      }
      //insert doc
      try{
        Display.insertOne(registerDoc)
      }
      catch(e){
        console.error('unable to add new display:' + e)
      }
    }

    static async deleteDisplay(company, store, display){
      Display.deleteOne({company:company, store:store, display:display});
    }

    static async listDisplays(company, store){
      var result = await Display.find({company:company, store:store}, {projection:{_id:0, company:0, store:0, displayID:0, mediaCount:0}}).toArray();
      console.log(result)
      return result;
    }
	
    static async checkQR(company, store, display, QRID){
      const result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{QRID:QRID}}});
      if(result){
        return true;
      }
      return false;
    }
	
    static async addQR(company, store, display, linkedURI){
      //generate display id
	  const QRID = uuidv4();
	  
	  let cleanQRID = "";
	  for (let sub of QRID) {
		  if (sub != '-') {
			cleanQRID+=sub;
		  }
	  }
	  cleanQRID = cleanQRID.slice(0,20);
	  
	  const timeCreated = new Date(Date.now());
	  
      let ID = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, mediaCount:1}})
      ID = ID.mediaCount;
      ID += 1;
	  try {
      	//add qr
      	Display.updateOne({company:company, store:store, display:display}, {$push:{media:{QRID:cleanQRID,timeCreated:timeCreated,linkedURI:linkedURI,voteCount:0}}});
      	//increment mediaCount
      	Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:ID}});
      }
      catch(e){
		  console.error('unable to add new display:' + e);
      }
  	}
	  
    static async deleteQR(company, store, display, QRID){
	  //delete QR
      Display.updateOne({company:company, store:store, display:display},{$pull:{media:{QRID:QRID}}}, {upsert:false});
      let ID = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, mediaCount:1}})
      ID = ID.mediaCount;
      ID -= 1;
      //increment mediaCount
      Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:ID}});
    }
	
    static async listQR(company, store, display){
      var result = await Display.find({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0, mediaCount:0, media:1, media:{voteCount:0}}}).toArray();
      return result;
    }
	
    static async patchQR(company, store, display, QRID, fields, values){
      let i = -1;
	  console.log(fields);
	  console.log(values);
      for (let field of fields){
        i++;
        let value = values[i];
        if(field == 'QRID'){
          //dont do anyhting lol just return a success anyway
        }
        else if (field == 'timeCreated'){
          await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.timeCreated":new Date(Date.now())}}, {upsert:false});
        }
        else if (field == 'linkedURI'){
          await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.linkedURI":value}}, {upsert:false});
        }
		else {
		  await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.voteCount":value}}, {upsert:false});
		}
      }
	}
}
module.exports = DisplayDAO;

/* This will come in use when we rework so im keeping it here for now
    static async checkDisplay(company, store, display){
      //get the list of display ID from store
      let result = await CompanyDAO.getList(company);
      //loop through and check if matching store and company exists
      for(let s of result.stores){
        if(s.store == store){
          for(let d of s.displays){
            if(d.display == display){
              return true;
            }
          }
          return false;
        }
      }
    }
    */
