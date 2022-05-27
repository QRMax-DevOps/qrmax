const { v4: uuidv4 } = require('uuid');
const MediaDAO = require("./MediaDAO.js");
const { setgroups } = require('process');
const UserInputDAO = require('./UserInputDAO.js');

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

    static async checkMedia(company, store, display, media){
      const result = await Display.findOne({company:company, store:store, display:display, });
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
		    currentQRPositions:0,
		    numberQRPositions:1,
        currentMedia:{
          media:"",
          liveTime: new Date(Date.now()),
          TTL:"0",
		    positions:[{x:0,y:0}]
        },
        settings:[]
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
	
    static async patchDisplay(company, store, display, fields, values){
      let i = -1;
      let restricted = ['company', 'store', 'displayID', 'mediaCount', 'baseMedia', 'currentMedia', 'settings'];
      for (let field of fields){
        i++;
        let value = values[i];
        if (restricted.includes(field)){
          return;
        }
        else{
          Display.updateOne({company:company, store:store, display:display}, {$set:{[field]:value}}, {upsert:false});
        }
      }
    }
		/*
        if(field == 'currentQRPositions'){
          await Display.updateOne({company:company, store:store, display:display}, {$set:{currentQRPositions:parseInt(value)}}, {upsert:false});
        }
		else {
			//return nothing
		}*/

    static async checkMedia(company, store, display, media){
      const result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{media:media}}});
      if(result){
        return true;
      }
      return false;
    }

    static async checkQR(company, store, display, QRID){
      const result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{QRID:QRID}}});
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
	
    static async addQR(company, store, display, media, mediaFile){
      
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
      const insert = {
        QRID:cleanQRID,
        QR_History:[cleanQRID],
        TTL:TTL,
        mediaID:cleanMediaID,
        media:media,
        voteCount:0,
        lifetimeVotes:0,
		    positions:[{x:0,y:0}]
      }
	    try {
      	//add qr
      	Display.updateOne({company:company, store:store, display:display}, {$push:{media:insert}});
      	//increment mediaCount
      	Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:ID}});
      }
      catch(e){
		    console.error('unable to add new display:' + e);
      }
      MediaDAO.newMedia(cleanMediaID, mediaFile);
  	}
	  
    static async deleteMedia(company, store, display, media){
	  //delete QR
      let ID = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, mediaCount:1, media:1}})
      let newID = ID.mediaCount;
      newID -= 1;

      let mediaID;
      try {
        for(var i = 0; i < ID.media.length; i++){
          console.log(ID.media[i].media+" - "+media);
          if(ID.media[i].media === media){
            mediaID = ID.media[i].mediaID;
            break;
          }
        }
        Display.updateOne({company:company, store:store, display:display},{$pull:{media:{media:media}}}, {upsert:false});
      
        //increment mediaCount
        Display.updateOne({company:company, store:store, display:display}, {$set:{mediaCount:newID}});
        //TODO delete media
        MediaDAO.deleteMedia(MediaID);
      }
      catch (e) {
        console.log(e);
      }
      

     
    }
	
    static async listQR(company, store, display){
      var result = await Display.find({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0, display:0, mediaCount:0}}).toArray();
      return result[0];
    }
	
    static async patchQR(company, store, display, media, fields, values){
      let i = -1;
      let DF = ['QRID', 'company', 'store', 'display', 'mediaCount', 'currentMedia', 'displayID', 'QR_History', 'lifetimeVotes', 'mediaID', 'voteCount', 'settings'];
      for (let field of fields){
        i++;
        let value = values[i];
        if (field == 'QRPositionAtCurrent'){
			    try {
	    	    var positions = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0, media:0, currentMedia:0}});
	    	    let positionalVal = positions.currentQRPositions;
	  		    var positionsArray = await Display.findOne({company:company, store:store, display:display, "media.media":media}, {projection:{"media.$":1}});
	  		    positionsArray = positionsArray.media[0].positions;
			      const xyArray = value.split(':');
			      positionsArray[positionalVal].x = parseInt(xyArray[0]);
			      positionsArray[positionalVal].y = parseInt(xyArray[1]);
	  		    console.log(positionsArray);
	  		    await Display.updateOne({company:company, store:store, display:display, "media.media":media}, {$set:{"media.$.positions":positionsArray}}, {upsert:false});
			    }
			    catch (e) {
				    console.log("fail");
			    }
        }
        else if(field == 'nextQRPosition'){
    	    var positions = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0, media:0, currentMedia:0}});
    	    let positionalVal = parseInt(positions.currentQRPositions);
            await Display.updateOne({company:company, store:store, display:display}, {$set:{currentQRPositions:parseInt(positionalVal+1)}}, {upsert:false});
          }
        else if(field == 'prevQRPosition'){
    	    var positions = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0, media:0, currentMedia:0}});
    	    let positionalVal = parseInt(positions.currentQRPositions);
            await Display.updateOne({company:company, store:store, display:display}, {$set:{currentQRPositions:parseInt(positionalVal-1)}}, {upsert:false});
          }
        else if(!DF.includes(field)){
          let setField = "media.$.".concat(field);
          await Display.updateOne({company:company, store:store, display:display, "media.media":media}, {$set:{[setField]:value}}, {upsert:false});
        }
        else{
          //dont do anyhting lol just return a success anyway
        }
      }
	}
	
	static async addVote(company, store, display, QRID) {
    var result = await Display.findOne({company:company, store:store, display:display, "media.QRID":QRID}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0}});
    let voteCount;
    let lifetimeVotes;
	  for(var i = 0; i < result.media.length; i++){
        if(result.media[i].QRID === QRID){
          voteCount = result.media[i].voteCount;
          lifetimeVotes = result.media[i].lifetimeVotes;
        }
	  }
      voteCount += 1;
      lifetimeVotes += 1;
      //increment voteCount
      await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.voteCount":parseInt(voteCount), "media.$.lifetimeVotes":parseInt(lifetimeVotes)}}, {upsert:false});
	  return true;
	}

  static async getMedia(company, store, display, media){
    let result = await Display.findOne({
      company:company,
      store:store,
      display:display,
      "media.media":media
    });
    //go through result and find media where media = media and store mediaID
    let mediaID;
    for(var i = 0; i < result.media.length; i++){
      if(result.media[i].media === media){
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

  static async getSetting(company, store, display){
    let result = await CompanyAccount.findOne({company:company, store:store, display:display}, {projection:{_id:0, settings:1}});
    return result;
}

  static async setSetting(company, store, display, fields, values){
    for (let i=0; i<fields.length; i++){
        let field = fields[i]
        CompanyAccount.updateOne({company:company, store:store, display:display}, {settings:{[field]:values[i]}}, {upsert:true});
    }
  }

  static async getSettings(company, store, display){
    let result = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, settings:1}});
    return result;
  }

  static async setSettings(company, store, display, fields, values){
    fields = fields.split(',');
    values = values.split(',');

    for (let i=0; i<fields.length; i++){
        let field = fields[i];
        await Display.updateOne({company:company, store:store, display:display}, {$pull:{settings:{[field]:{$exists:true}}}});
        await Display.updateOne({company:company, store:store, display:display}, {$addToSet:{settings:{[field]:values[i]}}});
    }
  }

  static async getInteractions(company, store, display, period){
    let result = await Display.findOne({company:company, store:store, display:display});
    let votes = [];
    if (period == 0){
      const media = result.media;
      for (let m of media){
        votes.push([m.media, m.lifetimeVotes]);
      }
      return votes;
    }
    else if (period == 1){
      const media = result.media;
      for (let m of media){
        let voteCount = 0;
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setHours(0);
          time.setMinutes(0);
          time.setSeconds(0);
          time.setMilliseconds(0);
          voteCount += await UserInputDAO.getVoteStats(time, m2)
          console.log(voteCount);
        }
        votes.push([m.media, voteCount]);
      }
      return votes;
    }
    else if (period == 2){
      const media = result.media;
      for (let m of media){
        let voteCount = 0;
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setHours(time.getHours()-1);
          voteCount += await UserInputDAO.getVoteStats(time, m2)
          console.log(voteCount);
        }
        votes.push([m.media, voteCount]);
      }
      return votes;
    }
    else if (period == 3){
      const media = result.media;
      for (let m of media){
        let voteCount = 0;
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setMinutes(time.getMinutes()-10);
          voteCount += await UserInputDAO.getVoteStats(time, m2)
          console.log(voteCount);
        }
        votes.push([m.media, voteCount]);
      }
      return votes;
    }
    else{
        return "no valid time given"
    }
  }

  static async refreshAllQR(company, store){
    //find each display
    let result = await Display.find({company:company, store:store}).toArray();
    //loop through displays
    for(let i=0; i<result.length;i++){
      //store display name 
      let dn = result[i].display;
      //for each media in display generate and assign a new QR
      for (let j=0; j<result[i].media.length; j++){
        let newQRID = uuidv4(); 
        let cleanQRID = "";
	      for (let sub of newQRID) {
		      if (sub != '-') {
			      cleanQRID+=sub;
		      }
	      }
	      cleanQRID = cleanQRID.slice(0,20);
        newQRID = cleanQRID;
        result[i].media[j].QRID = newQRID;
        result[i].media[j].QR_History.push(newQRID);
      }
      Display.updateOne({company:company, store:store, display:dn}, {$set:result[i]});
    }  
  }

  static async refreshSingleQR(company, store, display, media){
    //find specific media
    let result = await Display.findOne({company:company, store:store, display:display, media:{$elemMatch:{media:media}}});
    //generate new QRID
    let newQRID = uuidv4(); 
    let cleanQRID = "";
	    for (let sub of newQRID) {
		    if (sub != '-') {
			    cleanQRID+=sub;
		    }
	    }
	  cleanQRID = cleanQRID.slice(0,20);
    newQRID = cleanQRID;
    //Assign QRID to the media
    for (let i=0; i<result.media.length; i++){
      if (result.media[i].media == media){
        result.media[i].QRID = newQRID;
        result.media[i].QR_History.push(newQRID);
      }
    }
    //update record
    Display.updateOne({company:company, store:store, display:display, media:{$elemMatch:{media:media}}}, {$set:result});
  }

  static async refreshDisplayQR(company, store, display){
    //find store with specific display
    let result = await Display.findOne({company:company, store:store, display:display})
    //loop through media
    console.log(result);
    for (let i=0; i<result.media.length; i++){
      //generate new QRID
      let newQRID = uuidv4(); 
      let cleanQRID = "";
      for (let sub of newQRID) {
        if (sub != '-') {
          cleanQRID+=sub;
        }
      }
      cleanQRID = cleanQRID.slice(0,20);
      newQRID = cleanQRID;
      //assign new QRID
      result.media[i].QRID = newQRID;
      result.media[i].QR_History.push(newQRID);
    }   
    Display.updateOne({company:company, store:store, display:display}, {$set:result});
  }

static async setSetting(company, store, display, fields, values){
    for (let i=0; i<fields.length; i++){
        let field = fields[i]
        CompanyAccount.updateOne({company:company, store:store, display:display}, {settings:{[field]:values[i]}}, {upsert:true});
    }
}

static async getSettings(company, store, display){
  let result = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, settings:1}});
  return result;
}

static async setSettings(company, store, display, fields, values){
  fields = fields.split(',');
  values = values.split(',');

  for (let i=0; i<fields.length; i++){
      let field = fields[i];
      await Display.updateOne({company:company, store:store, display:display}, {$pull:{settings:{[field]:{$exists:true}}}});
      await Display.updateOne({company:company, store:store, display:display}, {$addToSet:{settings:{[field]:values[i]}}});
  }
}

static async addPosition(company, store, display, QRID, position) {
  	const xyArray = position.split(':');
	Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$push:{"media.$.positions":{x:parseInt(xyArray[0]), y:parseInt(xyArray[1])}}});
    /*var result = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0}});
    let voteCount;
	  for(var i = 0; i < result.media.length; i++){
        if(result.media[i].QRID === QRID){
          voteCount = result.media[i].voteCount;
        }
	  }
      voteCount += 1;
      //increment voteCount
      await Display.updateOne({company:company, store:store, display:display}, {$set:{"media.$.voteCount":parseInt(voteCount)}}, {upsert:false});
	  return true;*/
}

static async listPositions(company, store, display, QRID) {
	var result = await Display.findOne({company:company, store:store, display:display, "media.QRID":QRID}, {projection:{"media.$":1}});
    var index = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0, media:0, currentMedia:0}});
    let positionalVal = parseInt(index.currentQRPositions);
	var positionsArray = result.media[0].positions[positionalVal];
	
	return positionsArray;
}

static async deletePositions(company, store, display,QRID) {
	try {
	  var result = await Display.findOne({company:company, store:store, display:display, "media.QRID":QRID}, {projection:{"media.$":1}});
	  var positionsArray = result.media[0].positions;
	  
	  var result = await Display.findOne({company:company, store:store, display:display}, {projection:{_id:0, company:0, store:0, displayID:0,display:0, mediaCount:0, media:0, currentMedia:0}});
	  let positionalVal = parseInt(result.currentQRPositions);
	  
	  var newPositions = [];
	  for (let i=0; i<positionsArray.length; i++) {
		  if(i != positionalVal) {
			  newPositions.push(positionsArray[i]);
		  }
	  }
	  
	  if (positionalVal != 0) {
	  	await Display.updateOne({company:company, store:store, display:display}, {$set:{currentQRPositions:parseInt(positionalVal-1)}}, {upsert:false});
	  }
	  await Display.updateOne({company:company, store:store, display:display, "media.QRID":QRID}, {$set:{"media.$.positions":newPositions}}, {upsert:false});
	}
	catch (e) {
		console.log("fail");
	}
}



}

module.exports = DisplayDAO;
