const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const MediaDAO = require("./MediaDAO.js");
const { setgroups } = require('process');

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
        media:[],
        currentMedia:{
          media:"",
          liveTime: new Date(Date.now()),
          TTL:"0"
        },
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
      return result;
    }
	
    static async checkMedia(company, store, display, mediaName){
      const result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{media:mediaName}}});
      if(result){
        return true;
      }
      return false;
    }

    static async checkQR(company, store, display, mediaName){
      const result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{media:mediaName}}});
      if(result){
        return true;
      }
      return false;
    }
	
    static async addQR(company, store, display, mediaName, mediaFile){
      
      //generate qr id
	    const QRID = uuidv4();
      
	    let cleanQRID = "";
	    for (let sub of QRID) {
		    if (sub != '-') {
			    cleanQRID+=sub;
		    }
	    }
	    cleanQRID = cleanQRID.slice(0,20);

      const mediaID = uuidv4();

      let cleanMediaID = "";
	    for (let sub of mediaID) {
		    if (sub != '-') {
			    cleanMediaID+=sub;
		    }
	    }
	    cleanMediaID = cleanMediaID.slice(0,20);
	  
	    const TTL = 15;
	  
      let ID = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, mediaCount:1}})
      ID = ID.mediaCount;
      ID += 1;
	    try {
      	//add qr
      	Display.updateOne({company:company, store:store, display:display}, {$push:{media:{QRID:cleanQRID,TTL:TTL,mediaID:cleanMediaID,media:mediaName,voteCount:0}}});
      	//increment mediaCount
      	Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:ID}});
      }
      catch(e){
		    console.error('unable to add new display:' + e);
      }
      MediaDAO.newMedia(cleanMediaID, mediaFile);
  	}
	  
    static async deleteMedia(company, store, display, mediaName){
	  //delete QR
      let ID = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, mediaCount:1, media:1}})
      ID = ID.mediaCount;
      ID -= 1;

      let mediaID;
      for(var i = 0; i < ID.media.length; i++){
        if(ID.media[i].media === mediaName){
          mediaID = ID.media[i].mediaID;
          break;
        }
      }

      Display.updateOne({company:company, store:store, display:display},{$pull:{media:{media:mediaName}}}, {upsert:false});
      
      //increment mediaCount
      Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:ID}});
      //TODO delete media
      MediaDAO.deleteMedia(MediaID);
    }
	
    static async listQR(company, store, display){
      var result = await Display.find({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0, mediaCount:0}}).toArray();
      return result;
    }
	
    static async patchQR(company, store, display, QRID, fields, values){
      let i = -1;
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
		  await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.voteCount":parseInt(value)}}, {upsert:false});
		}
      }
	}
	
	static async addVote(company, store, display, QRID) {
      var result = await Display.findOne({company:company, store:store, display:display, "media.QRID":QRID}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0}});
	  let voteCount;
	  for(var i = 0; i < result.media.length; i++){
        if(result.media[i].QRID === QRID){
          voteCount = result.media[i].voteCount;
        }
	  }
      voteCount += 1;
      //increment voteCount
      await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.voteCount":parseInt(voteCount)}}, {upsert:false});
	  return true;
	}

  static async getMedia(company, store, display, mediaName){
    let result = await Display.findOne({
      company:company,
      store:store,
      display:display,
      "media.media":mediaName
    });
    //go through result and find media where media = mediaName and store mediaID
    let mediaID;
    for(var i = 0; i < result.media.length; i++){
      if(result.media[i].media === mediaName){
        mediaID = result.media[i].mediaID;
        break;
      }
    }
    //send to MediaDAO
    const mediaReturn = await MediaDAO.retrieveMedia(mediaID);
    //return media
    return mediaReturn;
  }

  static async getMostVoted(company, store, display){
    //get store
    let result = await Display.findOne({
      company:company,
      store:store,
      display:display,
    });
    let highest = -1;
    let highestMedia = 0;
    //loop through media & select one with highest voteCount
    for(var i = 0; i < result.media.length; i++){
      if(result.media[i].voteCount > highest){
        highest = result.media[i].voteCount;
        highestMedia = i;
      }
    }
    //return mediaID
    return highestMedia;
  }

  static async resetVoteCounts(company, store, display){
    Display.updateOne(
      {
        company:company,
        store:store,
        display:display,
      },
      {$set:
        {
          "media.$[elem].voteCount":0
        }
      },
      {
        "arrayFilters":[
          {
            "elem.voteCount":{
              $gt:0
            }
          }
        ],
        multi:true
      }
    )
  }

  static async getCurrentMedia(company, store, display){
    // just return the currentMedia object
    const result = await Display.findOne(
      {
        company:company,
        store:store,
        display:display
      },
      {
        projection:{
          _id:0,
          currentMedia:1
        }
      }
    )
    return result;
  }

  static async setCurrentMedia(company, store, display, highestMedia, desiredDisplay){
    const result = await Display.findOne(
      {
        company:company,
        store:store,
        display:display
      }
    )
    // loop through till name matches highest media
    //loop through media & select one with highest voteCount
    const selectedMedia = result.media[highestMedia];
    // pull all the necessary info out, make new timestamp
    const media = selectedMedia.media;
    const liveTime = new Date(Date.now());
    const TTL = selectedMedia.TTL;
    //set as current media
    Display.updateOne(
      {
        company:company,
        store:store,
        display:display
      },
      {
        $set:{
          "currentMedia.media": media,
          "currentMedia.liveTime":liveTime,
          "currentMedia.TTL":TTL
        }
      }
    )
    await new Promise(resolve => setTimeout(resolve, 250));
    this.resetVoteCounts(company, store, desiredDisplay);
  }

  //used to set media to message that it should currently show the QR
  static async setCurrentMediaQR(company, store, display){
    const liveTime = new Date(Date.now());
    Display.updateOne(
      {
        company:company,
        store:store,
        display:display
      },
      {
        $set:{
          "currentMedia.media": "displayQR", // set media to special code to displayQR
          "currentMedia.liveTime":liveTime,
          "currentMedia.TTL":10 //set ttl to 10 seconds
        }
      }
    )
  }

  static async loopCurrentMedia(company, store, display){
    // get display
    var display = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, displayID:0}})
    if (display.mediaCount > 0){

      const cTime = new Date(Date.now());
      let liveTime = display.currentMedia.liveTime;
      liveTime = new Date(liveTime);
      liveTime = new Date(liveTime.getTime() + (display.currentMedia.TTL * 1000))

      if (cTime >= liveTime){
        if(display.currentMedia.media === "displayQR"){
          const company = display.company; 
          const store = display.store;
          const desiredDisplay = display.display;
          const highestMedia = await this.getMostVoted(company, store, desiredDisplay);
          //switch to new media
          this.setCurrentMedia(company, store, desiredDisplay, highestMedia, desiredDisplay);
          //send message to display new media
          return "newMedia";
        }
        else{
          const company = display.company; 
          const store = display.store;
          const desiredDisplay = display.display;
          const highestMedia = await this.getMostVoted(company, store, desiredDisplay);
          this.setCurrentMediaQR(company, store, desiredDisplay, highestMedia);
          //send message to display QR
          return "QR";
        }
      }
    }
    return null;
  }

  static async listen(company, store, display){
    //call loop
    let rMessage = null;
    while (rMessage == null){
      await new Promise(resolve => setTimeout(resolve, 250));
      rMessage = await this.loopCurrentMedia(company, store, display);
    }
    return rMessage;
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
