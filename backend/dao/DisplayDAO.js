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