const { v4: uuidv4 } = require('uuid');
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

    static async newDisplay(company, store, display, addDisplay){
      //generate display id
      const id = uuidv4();
      //generate document
      const registerDoc = {
        displayID: id,
        display: display,
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
      //addDisplay to relevant store
      addDisplay(company, store, id)
    }

}
module.exports = DisplayDAO;