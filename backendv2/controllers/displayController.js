const asyncHandler = require('express-async-handler');
const displayModel = require('../models/displayModel');
const media = require('../models/mediaModel');
const mediaFileModel = require('../models/mediaFileModel');
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require('jsonwebtoken');
const gridfs = require('gridfs');
const mediaModel = require('../models/mediaModel');

// @desc    Create display
// @route   PUT /api/v2/Display
// @access  Private
// @review  Complete
const putDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.displayName;
  //Check if display exists
  const displayExists = await displayModel.findOne({store:req.store.id, displayName:displayName });
  if (displayExists) {
	  res.status(400).json({status:"fail",cause:"Display already exists"});
	  throw new Error('Display already exists');
  }

  if(!(req.body.displayType&&req.body.location)){
    res.status(400).json({status:"fail",cause:"Missing display information"});
	  throw new Error('Missing display information');
  }

  var displaytype = req.body.displayType;

  if (displaytype != 'static' && displaytype != 'dynamic'){
    res.status(400).json({status:"fail",cause:"Invalid display type"});
	  throw new Error('Invalid display type');
  }

  var location = req.body.location;
  
  const displayCreate = await displayModel.create({
    displayName: displayName,
	  store: req.store.id,
    media:[],
    currentContent:{media:'', mediaBase:'Base', liveTime:new Date(Date.now()), TTL:0},
    displayType:displaytype,
    location:location,
    baseMedia:'',
    settings:[],
  });

  if (displayCreate) {
    res.status(201).json({status:"success"});
  } 
  else {
	  res.status(400).json({status:"fail",cause:"Invalid display data"});
	  throw new Error('Invalid display data');
  }
});

// @desc    Get displays
// @route   POST /api/v2/Display
// @access  Private
// @review  Complete
const postDisplay = asyncHandler(async (req, res) => {
  const storeID = req.store.id;
  
  //Check if display exists
  const displays = await displayModel.find({store:storeID}, {_id:0,displayName:1,media:1});
	
  if (!displays) {
	  res.status(400).json({status:"success",cause:"No displays for store"});
	  throw new Error('No displays for store');
  }

  for (let i = 0; i<displays.length; i++){
    for (let j = 0; j<displays[i].media.length; j++){
      displays[i].media[j] = await mediaModel.findById(displays[i].media[j]);
      displays[i].media[j] = displays[i].media[j].mediaName;
    }
  }
	res.status(200).json({status:"success",displays});
});

// @desc    Delete display
// @route   DELETE /api/v2/Display
// @access  Private
// @review  Complete
const deleteDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.displayName;
  
  //Check if display exists
  const displayExists = await displayModel.find({store:req.store.id, displayName:displayName});
	
  if (!displayExists) {
	  res.status(400).json({status:"fail",cause:'No displays found'});
	  throw new Error('No displays found');
  }
  
  await displayModel.remove({store:req.store.id, displayName:displayName});
  res.status(200).json({status:"success"});
});

// @desc    Patch display
// @route   PATCH /api/v2/Display
// @access  Private
// @review  Complete
const patchDisplay = asyncHandler(async (req, res) => {
  const { fields, values, displayName } = req.body;

  if(!(fields&&values&&displayName)){
    res.status(400).json({status:"fail", cause:"Missing patch information"});
    throw new Error('Missing patch information') 
  }

  const displayAcct = await displayModel.findOne({store:req.store.id, displayName:displayName});
  
  if (!displayAcct) {
    res.status(400).json({status:"fail", cause:"Display does not exist"});
    throw new Error('Display Does Not Exist') 
  }

  //ensure field is a legal field to operate on
  fields.split(',').forEach((field, i)=>{
    if (!(field == "displayName" || field == 'displayType' || field == 'location')){
      res.status(400).json({status:"fail", cause:"Illegal operation on field "+field});
    }
  })

  fields.split(',').forEach(async (field, i)=>{
    if(field == 'displayName'){
      if (await displayModel.findOne({store:req.store.id, displayName:values.split(',')[i]})) {
	      res.status(400).json({status:"fail", cause:"Display name already in use"});
      }
      else{
        await displayModel.updateOne({store:req.store.id, displayName:displayName}, {$set:{displayName:values.split(',')[i]}});
        res.status(200).json({status:"success"});
      }
              
    }

    else if(field == 'displayType'){
      if (!(values.split(',')[i] == 'static' || values.split(',')[i] == 'dynamic')){
        res.status(400).json({status:"fail", cause:"Illegal display type"});
      }   
    }

    if(!res.headersSent){
      await displayModel.updateOne({store:req.store.id, displayName:displayName}, {$set:{[field]:values.split(',')[i]}});     
      res.status(200).json({status:"success"});
    }
  })
});

// @desc    Create new media
// @route   PUT /api/v2/Display/media
// @access  Private
// @review  Complete
const putDisplayMedia = asyncHandler(async (req, res) => {  
  //get all the info and check it is ok
  const {display, mediaName, mediaFile, TTL} = req.body;
  if(!(display&&mediaName&&mediaFile&&TTL)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  //generate a clean QRID
  const QRID = uuidv4();
  let cleanQRID = "";
  for (let sub of QRID) {
    if (sub != '-') {
      cleanQRID+=sub;
    }
  }
  cleanQRID = cleanQRID.slice(0,20);

  //var mediaFileByteLength = Buffer.byteLength(mediaFile);
  var mediaFileNumChunks = Math.ceil(mediaFile.length / 1024);
  var mediaFileChunks = new Array(mediaFileNumChunks);

  for (let i = 0, o = 0; i < mediaFileNumChunks; ++i, o += 1024) {
    mediaFileChunks[i] = mediaFile.substr(o, 1024)
  }

  //check if display exists
  let foundDisplay = await displayModel.findOne({displayName:display, store:req.store.id})
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }
  
  
  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:mediaName});

  //check if media name already in use
  if(foundMedia){
    res.status(400).json({status:"fail", cause:"Media name already in use"});
    throw new Error('Media name already in use') 
  }

  //make new media obj
  const createdMedia = await media.create({
    display:foundDisplay._id,
    QRID:cleanQRID,
    QR_History:[cleanQRID],
    mediaName:mediaName,
    mediaFileChunks:mediaFileNumChunks,
    voteCount:0,
    lifetimeVotes:0,
    TTL:TTL,
  })

  //add media to store
  await displayModel.updateOne({store:req.store.id, displayName:display}, {$push:{media:createdMedia.id}})

  //for each mediaFileChunk make a new mediaFileChunk object
  mediaFileChunks.forEach((chunk, i)=>{
    mediaFileModel.create({
      mediaID:createdMedia._id,
      chunkNumber:i+1,
      data:chunk,
    })
  })

  res.status(200).json({status:"success"});
});

// @desc    Get media object
// @route   POST /api/v2/Display/media
// @access  Private
// @review  Complete
const postDisplayMedia = asyncHandler(async (req, res) => {
  //get all the info and check it is ok
  const {display} = req.body;
  if(!(display)){
    res.status(400).json({status:"fail", cause:"Missing display"});
    throw new Error('Missing display'); 
  }
  //get all media id from display
  let displays = await displayModel.findOne({displayName:display, store:req.store.id}, {_id:0, displayName:1, media:1});

  //check if display exists
  if(!(displays)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }

  for (let i=0; i<displays.media.length; i++){
    displays.media[i] = await mediaModel.findById(displays.media[i], {_id:0, QR_History:0, mediaFileChunks:0, lifetimeVotes:0, __v:0});
  }
  
  //for each media list QRID, TTL, mediaName, voteCount, currentMedia
  res.status(200).json({status:"success", media:displays.media});
});

// @desc    Patch media
// @route   PATCH /api/v2/Display/media
// @access  Private
// @review  Complete
const patchDisplayMedia = asyncHandler(async (req, res) => {
  const { fields, values, displayName } = req.body;
  const sFields = fields.split(',');
  const sValues = values.split(',');

  if(!(fields&&values&&displayName)){
    res.status(400).json({status:"fail", cause:"Missing patch information"});
    throw new Error('Missing patch information') 
  }

  let foundDisplay = await displayModel.findOne({displayName:display, store:req.store.id})

  //check if display exists
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }

  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:mediaName});

  //check media exists
  if(!foundMedia){
    res.status(400).json({status:"fail", cause:"Media not found"});
    throw new Error('Media not found') 
  }

  //ensure field is a legal field to operate on
  const legalFields = ['mediaName', 'mediaFile', 'TTL'];
  for(let i = 0; i<sFields.length; i++){
    if (!(legalFields.includes(sFields[i]))){
      res.status(400).json({status:"fail", cause:"Illegal operation on field "+field});
      throw new Error("Illegal operation on field") 
    }
  }

  //check fileName not already in use
  for (let i=0; i<sFields.length;i++){
    let field = sFields[i];
    let value = sValues[i];
    if (field == 'fileName'){
      //check fileName no already used
      if(await mediaModel.findOne({mediaName:value, display:foundDisplay._id})){
        res.status(400).json({status:"fail", cause:"Media name already in use"+field});
        throw new Error("Media name already in use")
      }
    } 
  }

  sFields.forEach(async (field, i)=>{
    if (field == 'fileName'){
      //change fileName
      await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{mediaName:sValues[i]}})
    } 
    else if (field == 'mediaFile'){
      //delete all old mediaFiles
      mediaFileModel.deleteMany({mediaID:foundMedia._id});
      //create new ones
        
      var mediaFileNumChunks = Math.ceil(mediaFile.length / 1024);
      var mediaFileChunks = new Array(mediaFileNumChunks);

      mediaFileChunks.forEach((chunk, i)=>{
        mediaFileModel.create({
          mediaID:foundMedia._id,
          chunkNumber:i+1,
          data:chunk,
        })
      })
    }
  })

  res.status(201).json({status:"success"});
});

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const deleteDisplayMedia = asyncHandler(async (req, res) => {
  //get all the info and check it is ok
  const {display, mediaName} = req.body;
  if(!(display&&mediaName)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  
  let foundDisplay = await displayModel.findOne({displayName:display, store:req.store.id})

  //check if display exists
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }

  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:mediaName});

  //check media exists
  if(!foundMedia){
    res.status(400).json({status:"fail", cause:"Media not found"});
    throw new Error('Media not found') 
  }

  //delete media  
  await mediaModel.deleteOne({display:foundDisplay._id, mediaName:mediaName})

  //delete all mediaFile
  await mediaFileModel.deleteMany({mediaID:foundMedia._id});

  //remove from display
 
  let id = foundMedia._id.toString();
  await displayModel.updateOne({displayName:display, store:req.store.id}, {$pull:{media:id}})

  res.status(200).json({status:"success"});
}); 

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const postDisplayMediaFile = asyncHandler(async (req, res)=>{ 
  const {display, mediaName} = req.body;
  if(!(display&&mediaName)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  
  console.log("req.store ===", req.store);
  console.log("req.body === ",req.body);
  console.log("req.body.store ===", req.body.store);
  console.log("req.body.store.id ===", req.body.store.id);
  
  let foundDisplay = await displayModel.findOne({displayName:display, store:req.body.store.id})

  //check if display exists
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }

  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:mediaName});

  //check media exists
  if(!foundMedia){
    res.status(400).json({status:"fail", cause:"Media not found"});
    throw new Error('Media not found') 
  }

  let mediaFile = '';
  for(let i = 1; i<=foundMedia.mediaFileChunks;i++){
    let foundMediaFile = await mediaFileModel.findOne({mediaID:foundMedia._id, chunkNumber:i})
    mediaFile += foundMediaFile.data;
  }

  res.status(200).json({status:"success", mediaFile});
})

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const postDisplaySettings = asyncHandler(async (req, res)=>{ 
  const {display} = req.body;
  const settings = await displayModel.findOne({store:req.store.id, displayName:display}, {_id:0, settings:1});
  
  if(!settings){
    res.status(401).json({status:"fail",cause:'Issue finding company'});
    throw new Error('Issue finding company');
  }

  res.status(200).json({status:"success",settings});
})

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const patchDisplaySettings = asyncHandler(async (req, res)=>{ 
  const {display} = req.body;
  const updatedAccount = displayModel.findOne({store:req.store.id, displayName:display});
  
  if(!updatedAccount){
    res.status(401).json({status:"fail",cause:'Issue finding store'});
    throw new Error('Issue finding store to update');
  }

  var fields = req.body.fields.split(',');
  var values = req.body.values.split(',');

  fields.forEach(async (field, index)=>{
    await displayModel.updateOne({store:req.store.id, displayName:display}, {$pull:{settings:{[field]:{$exists:true}}}});
    await displayModel.updateOne({store:req.store.id, displayName:display}, {$push:{settings:{[field]:values[index]}}});
  })
  
  res.status(200).json({status:"success"});
})

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const postDisplayMediaRefresh = asyncHandler(async (req, res)=>{
  const {display, mediaName} = req.body;
  
  //update single media
  if (mediaName && display){
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

    let foundDisplay = await displayModel.findOne({store:req.store.id, displayName:display});
    if(!foundDisplay){
      res.status(401).json({status:"fail",cause:'Issue finding display'});
      throw new Error('Issue finding display');
    }
    let foundMedia = await mediaModel.findOne({displayID:foundDisplay._id, mediaName:mediaName});
    if(!foundMedia){
      res.status(401).json({status:"fail",cause:'Issue finding media'});
      throw new Error('Issue finding media');
    }
    let currentQR = foundMedia.QRID;
    await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{QRID:cleanQRID}, $push:{QR_History:currentQR}})
  }

  //error
  else if (media && !display){
    res.status(401).json({status:"fail",cause:'Provided media but no display'});
    throw new Error('Provided media but no display');
  }

  //update all in display
  else if(display){
    let foundDisplay = await displayModel.findOne({store:req.store.id, displayName:display});
    if(!foundDisplay){
      res.status(401).json({status:"fail",cause:'Issue finding display'});
      throw new Error('Issue finding display');
    }
    for (let i=0; i<foundDisplay.media.length;i++){
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
      //Update media
      let foundMedia = await mediaModel.findOne({displayID:foundDisplay.media[i]});
      let currentQR = foundMedia.QRID;
      await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{QRID:cleanQRID}, $push:{QR_History:currentQR}})
    }
  }

  //update all in store
  else{
    //find all displays
    let displays = await displayModel.find({store:req.store.id});
    if(!displays){
      res.status(401).json({status:"fail",cause:'Issue finding displays'});
      throw new Error('Issue finding displays');
    }
    displays.forEach(async (display)=>{
      for (let i=0; i<display.media.length;i++){
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
        //Update media
        let foundMedia = await mediaModel.findId({displayID:display.media[i]});
        let currentQR = foundMedia.QRID;
        await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{QRID:cleanQRID}, $push:{QR_History:currentQR}})
      }
    })
  }

  res.status(200).json({status:"success"});
})

const putDisplayMediaBaseMedia = asyncHandler(async (req, res)=>{
  const {display, mediaName, mediaFile, TTL }= req.body;
  if(!(display&&mediaName&&mediaFile&&TTL)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  //generate a clean QRID
  const QRID = uuidv4();
  let cleanQRID = "";
  for (let sub of QRID) {
    if (sub != '-') {
      cleanQRID+=sub;
    }
  }
  cleanQRID = cleanQRID.slice(0,20);

  //var mediaFileByteLength = Buffer.byteLength(mediaFile);
  var mediaFileNumChunks = Math.ceil(mediaFile.length / 1024);
  var mediaFileChunks = new Array(mediaFileNumChunks);

  for (let i = 0, o = 0; i < mediaFileNumChunks; ++i, o += 1024) {
    mediaFileChunks[i] = mediaFile.substr(o, 1024)
  }

  //check if display exists
  let foundDisplay = await displayModel.findOne({displayName:display, store:req.store.id})
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }
  
  
  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:mediaName});

  //check if media name already in use
  if(foundMedia){
    res.status(400).json({status:"fail", cause:"Media name already in use"});
    throw new Error('Media name already in use') 
  }

  //make new media obj
  const createdMedia = await media.create({
    display:foundDisplay._id,
    QRID:cleanQRID,
    QR_History:[cleanQRID],
    mediaName:mediaName,
    mediaFileChunks:mediaFileNumChunks,
    voteCount:0,
    lifetimeVotes:0,
    TTL:TTL,
  })

  //add media to store
  await displayModel.updateOne({store:req.store.id, displayName:display}, {baseMedia:createdMedia.id})

  //for each mediaFileChunk make a new mediaFileChunk object
  mediaFileChunks.forEach((chunk, i)=>{
    mediaFileModel.create({
      mediaID:createdMedia._id,
      chunkNumber:i+1,
      data:chunk,
    })
  })

  res.status(200).json({status:"success"});
})

const postDisplayMediaBaseMedia = asyncHandler(async (req, res)=>{
  //get all the info and check it is ok
  const {display} = req.body;
  if(!(display)){
    res.status(400).json({status:"fail", cause:"Missing display"});
    throw new Error('Missing display'); 
  }
  //get all media id from display
  let baseMediaDisplay = await displayModel.findOne({displayName:display, store:req.store.id});
  let baseMedia = await mediaModel.findById(baseMediaDisplay.baseMedia);
  let baseMediaFile = '';
  for(let i = 1; i<=baseMedia.mediaFileChunks; i++){
    let foundMediaFile = await mediaFileModel.findOne({mediaID:baseMedia._id, chunkNumber:i})
    baseMediaFile += foundMediaFile.data;
  }
  
  //for each media list QRID, TTL, mediaName, voteCount, currentMedia
  res.status(200).json({status:"success", baseMedia:baseMedia.mediaName, baseMediaFile:baseMediaFile});
})

const postDisplayMediaListen = asyncHandler(async (req, res)=>{
  const {display} = req.body; 
  //call loop
   let rMessage = null;
   while (rMessage == null){
     await new Promise(resolve => setTimeout(resolve, 250));
     rMessage = await loopCurrentMedia(display);
   }
   res.json({staus:"success", display:rMessage});
})

//every .250 seconds check for a potential change
//

const loopCurrentMedia = asyncHandler((display) =>{
  /*
  var display = await Display.findOne({store:req.store.id, display:display});
  if (display.media.length > 0){
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
  */
});

  

module.exports = {
  putDisplay,
  postDisplay,
  patchDisplay,
  deleteDisplay,
  putDisplayMedia,
  postDisplayMedia,
  patchDisplayMedia,
  deleteDisplayMedia,
  postDisplayMediaFile,
  postDisplaySettings,
  patchDisplaySettings,
  postDisplayMediaRefresh,
  putDisplayMediaBaseMedia,
  postDisplayMediaBaseMedia,
  postDisplayMediaListen
}