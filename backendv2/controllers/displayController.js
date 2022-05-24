const asyncHandler = require('express-async-handler');
const displayModel = require('../models/displayModel');
const media = require('../models/mediaModel');
const mediaFileModel = require('../models/mediaFileModel');
const userInput = require('../models/userInputModel');
const { v4: uuidv4 } = require('uuid');
const mediaModel = require('../models/mediaModel');
const storeModel = require('../models/storeModel');

// @desc    Create display
// @route   PUT /api/v2/Display
// @access  Private
// @review  Complete
const putDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.display;
  const {lat, lon} = req.body;
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  //Check if display exists
  const displayExists = await displayModel.findOne({store:storeID, displayName:displayName });
  if (displayExists) {
    res.status(400).json({status:"fail",cause:"Display already exists"});
    throw new Error('Display already exists');
  }

  if(!(req.body.displayType&&req.body.lat&&req.body.lon)){
    res.status(400).json({status:"fail",cause:"Missing display information"});
    throw new Error('Missing display information');
  }

  var displaytype = req.body.displayType;

  if (displaytype != 'static' && displaytype != 'dynamic'){
    res.status(400).json({status:"fail",cause:"Invalid display type"});
    throw new Error('Invalid display type');
  }

  const displayCreate = await displayModel.create({
    displayName: displayName,
    store: storeID,
    media:[],
    currentContent:{media:null, mediaBase:true, liveTime:new Date(Date.now()), TTL:0},
    displayType:displaytype,
    baseMedia:null,
    settings:[],
    lat:lat,
    lon:lon,
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
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  
  //Check if display exists
  const displays = await displayModel.find({store:storeID}, {_id:0,displayName:1,media:1,QRID:1});
	
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
  const displayName = req.body.display;

  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  
  //Check if display exists
  const displayExists = await displayModel.findOne({store:storeID, displayName:displayName});
	
  if (!displayExists) {
    res.status(400).json({status:"fail",cause:'No displays found'});
    throw new Error('No displays found');
  }

  displayExists.media.forEach(async (media)=>{
    //delete all mediaFile
    await mediaFileModel.deleteMany({media:media})
    //delete media
    await mediaModel.findByIdAndDelete(media)
  })
  
  await displayModel.deleteOne({store:storeID, displayName:displayName});
  res.status(200).json({status:"success"});
});

// @desc    Patch display
// @route   PATCH /api/v2/Display
// @access  Private
// @review  Complete
const patchDisplay = asyncHandler(async (req, res) => {
  const displayName = req.body.display;
  const { fields, values} = req.body;
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;

  if(!(fields&&values&&displayName)){
    res.status(400).json({status:"fail", cause:"Missing patch information"});
    throw new Error('Missing patch information') 
  }

  const displayAcct = await displayModel.findOne({store:storeID, displayName:displayName});
  
  if (!displayAcct) {
    res.status(400).json({status:"fail", cause:"Display does not exist"});
    throw new Error('Display Does Not Exist') 
  }

  //ensure field is a legal field to operate on
  fields.split(',').forEach((field)=>{
    if (!(field == "displayName" || field == 'displayType' || field == 'location')){
      res.status(400).json({status:"fail", cause:"Illegal operation on field "+field});
    }
  })

  fields.split(',').forEach(async (field, i)=>{
    if(field == 'displayName'){
      if (await displayModel.findOne({store:storeID, displayName:values.split(',')[i]})) {
        res.status(400).json({status:"fail", cause:"Display name already in use"});
      }
      else{
        await displayModel.updateOne({store:storeID, displayName:displayName}, {$set:{displayName:values.split(',')[i]}});
        res.status(200).json({status:"success"});
      }
              
    }

    else if(field == 'displayType'){
      if (!(values.split(',')[i] == 'static' || values.split(',')[i] == 'dynamic')){
        res.status(400).json({status:"fail", cause:"Illegal display type"});
      }   
    }

    if(!res.headersSent){
      await displayModel.updateOne({store:storeID, displayName:displayName}, {$set:{[field]:values.split(',')[i]}});     
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
  const {store, display, mediaName, mediaFile, TTL} = req.body;
  if(!(store&&display&&mediaName&&mediaFile&&TTL)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
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
  let foundDisplay = await displayModel.findOne({displayName:display, store:storeID})
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
  await displayModel.updateOne({store:storeID, displayName:display}, {$push:{media:createdMedia.id}})

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
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;

  //get all media id from display
  let displays = await displayModel.findOne({displayName:display, store:storeID}, {_id:0, displayName:1, media:1});

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
  const displayName = req.body.display;
  let mediaName = req.body.mediaName;
  const {store, fields, values } = req.body;
  const sFields = fields.split(',');
  const sValues = values.split(',');
  

  if(!(store&&fields&&values&&displayName)){
    res.status(400).json({status:"fail", cause:"Missing patch information"});
    throw new Error('Missing patch information') 
  }
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;

  let foundDisplay = await displayModel.findOne({displayName:displayName, store:storeID})

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
      res.status(400).json({status:"fail", cause:"Illegal operation on field "+sFields[i]});
      throw new Error("Illegal operation on field") 
    }
  }

  //check fileName not already in use
  for (let i=0; i<sFields.length;i++){
    let field = sFields[i];
    let value = sValues[i];
    if (field == 'mediaName'){
      //check fileName no already used
      if(await mediaModel.findOne({mediaName:value, display:foundDisplay._id})){
        res.status(400).json({status:"fail", cause:"Media name already in use"+field});
        throw new Error("Media name already in use")
      }
    } 
  }

  //sFields.forEach(async (field, i)=>{
  for(let i=0, j=0; i<sFields.length; i++, j++){
    let field = sFields[i];
    if (field == 'mediaName'){
      //change fileName
      await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{mediaName:sValues[j]}})
      mediaName = sValues[j];
    } 
    else if (field == 'mediaFile'){
      //value combine
      let mediaFileValue = sValues[j]+sValues[j+1];
      j++;
      //delete all old mediaFiles
      await mediaFileModel.deleteMany({mediaID:foundMedia._id});
      //create new ones
      var mediaFileNumChunks = Math.ceil(mediaFileValue.length / 1024);
      var mediaFileChunks = new Array(mediaFileNumChunks);
      
      for (let i = 0, o = 0; i < mediaFileNumChunks; ++i, o += 1024) {
        mediaFileChunks[i] = mediaFileValue.substr(o, 1024)
      }

      mediaFileChunks.forEach((chunk, i)=>{
        mediaFileModel.create({
          mediaID:foundMedia._id,
          chunkNumber:i+1,
          data:chunk,
        })
      })
    }
    else if (field == 'TTL'){
      //change TTL
      await mediaModel.findByIdAndUpdate(foundMedia._id, {$set:{TTL:sValues[j]}})
    }
  }

  res.status(201).json({status:"success"});
});

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const deleteDisplayMedia = asyncHandler(async (req, res) => {
  //get all the info and check it is ok
  const {store, display, mediaName} = req.body;
  if(!(store&&display&&mediaName)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }

  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  
  let foundDisplay = await displayModel.findOne({displayName:display, store:storeID})

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
  let mID = foundMedia._id;
  mID = mID.toString().replace('new ObjectId("', '');
  mID = mID.replace('")"', '');
  console.log(mID)
  console.log('test')
  console.log(await displayModel.findByIdAndUpdate(foundDisplay._id, {$pull:{media:mID}}));

 
  let id = foundMedia._id.toString();
  await displayModel.updateOne({displayName:display, store:req.store.id}, {$pull:{media:id}})

  res.status(200).json({status:"success"});
}); 

// @desc    get media file
// @route   POST /api/v2/Display/media/file
// @access  Private
// @review  Complete
const postDisplayMediaFile = asyncHandler(async (req, res)=>{ 
  const {store, display, mediaName} = req.body;
  if(!(store&&display&&mediaName)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  
  let foundDisplay = await displayModel.findOne({displayName:display, store:storeID})

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
  const { display} = req.body;

  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;

  const settings = await displayModel.findOne({store:storeID, displayName:display}, {_id:0, settings:1});
  
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
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  const updatedAccount = displayModel.findOne({store:storeID, displayName:display});
  
  if(!updatedAccount){
    res.status(401).json({status:"fail",cause:'Issue finding store'});
    throw new Error('Issue finding store to update');
  }

  var fields = req.body.fields.split(',');
  var values = req.body.values.split(',');

  fields.forEach(async (field, index)=>{
    await displayModel.updateOne({store:storeID, displayName:display}, {$pull:{settings:{[field]:{$exists:true}}}});
    await displayModel.updateOne({store:storeID, displayName:display}, {$push:{settings:{[field]:values[index]}}});
  })
  
  res.status(200).json({status:"success"});
})

// @desc    Delete media object
// @route   DELETE /api/v2/Display/media
// @access  Private
// @review  Complete
const postDisplayMediaRefresh = asyncHandler(async (req, res)=>{
  const {display, mediaName} = req.body;

  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  
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

    let foundDisplay = await displayModel.findOne({store:storeID, displayName:display});
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
    let foundDisplay = await displayModel.findOne({store:storeID, displayName:display});
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
    let displays = await displayModel.find({store:storeID});
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

// @desc    put base media object
// @route   PUT /api/v2/Display/media/baseMedia
// @access  Private
// @review  Complete
const putDisplayMediaBaseMedia = asyncHandler(async (req, res)=>{
  const {store, display, baseMedia, baseMediaFile, TTL }= req.body;
  if(!(store&&display&&baseMedia&&baseMediaFile&&TTL)){
    res.status(400).json({status:"fail", cause:"Missing media information"});
    throw new Error('Missing media information') 
  }
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
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
  var mediaFileNumChunks = Math.ceil(baseMediaFile.length / 1024);
  var mediaFileChunks = new Array(mediaFileNumChunks);

  for (let i = 0, o = 0; i < mediaFileNumChunks; ++i, o += 1024) {
    mediaFileChunks[i] = baseMediaFile.substr(o, 1024)
  }

  //check if display exists
  let foundDisplay = await displayModel.findOne({displayName:display, store:storeID})
  if(!(foundDisplay)){
    res.status(400).json({status:"fail", cause:"Display not found"});
    throw new Error('Display not found') 
  }
  
  
  let foundMedia = await mediaModel.findOne({display:foundDisplay._id, mediaName:baseMedia});
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
    mediaName:baseMedia,
    mediaFileChunks:mediaFileNumChunks,
    voteCount:0,
    lifetimeVotes:0,
    TTL:TTL,
  })

  //delete all old baseMedia mediaFiles
  if (foundDisplay.baseMedia){
    await mediaFileModel.deleteMany({media:foundDisplay.baseMedia});
  }

  //add media to store
  await displayModel.updateOne({store:storeID, displayName:display}, {baseMedia:createdMedia.id})

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

// @desc    get base media object
// @route   POST /api/v2/Display/media/baseMedia
// @access  Private
// @review  Complete
const postDisplayMediaBaseMedia = asyncHandler(async (req, res)=>{
  //get all the info and check it is ok
  const {store,display} = req.body;
  if(!(store&&display)){
    res.status(400).json({status:"fail", cause:"Missing information"});
    throw new Error('Missing information'); 
  }
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  //get all media id from display
  let baseMediaDisplay = await displayModel.findOne({displayName:display, store:storeID});
  if(!baseMediaDisplay.baseMedia){
    res.status(400).json({status:"fail", cause:"Missing base media"});
    throw new Error('Missing base media'); 
  }
  let baseMedia = await mediaModel.findById(baseMediaDisplay.baseMedia);
  let baseMediaFile = '';
  for(let i = 1; i<=baseMedia.mediaFileChunks; i++){
    let foundMediaFile = await mediaFileModel.findOne({mediaID:baseMedia._id, chunkNumber:i})
    baseMediaFile += foundMediaFile.data;
  }
  
  //for each media list QRID, TTL, mediaName, voteCount, currentMedia
  res.status(200).json({status:"success", baseMedia:baseMedia.mediaName, baseMediaFile:baseMediaFile});
})

// @desc    listen for media change
// @route   POST /api/v2/Display/media/listen
// @access  Private
// @review  Not started
const postDisplayMediaListen = asyncHandler(async (req, res)=>{
  const {store, display} = req.body; 

  if(!(store&&display)){
    res.status(400).json({status:"fail", cause:"Missing information"});
    throw new Error('Missing information'); 
  }

  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  if(!storeID){
    res.status(400).json({status:"fail", cause:"No store found"});
    throw new Error('No store found'); 
  }
  storeID = storeID._id;

  let foundDisplay = await displayModel.findOne({store:storeID, displayName:display}) 
  let foundDisplayType = foundDisplay.displayType;
  
  if(!foundDisplay.baseMedia){
    res.status(400).json({status:"fail", cause:"Missing base media, please set a base media before continuing"});
    throw new Error('Missing base media'); 
  }
  if(!foundDisplay.media.length>0){
      res.status(400).json({status:"fail", cause:"No media, please add media before listening"});
      throw new Error('Missing base media'); 
  }
  if (foundDisplayType == 'dynamic'){
    let foundDisplayCurrentMedia = foundDisplay.currentContent;
    let liveTime = foundDisplayCurrentMedia.liveTime;
    const cTime = new Date(Date.now());
    liveTime = new Date(liveTime);
    liveTime = new Date(liveTime.getTime() + (foundDisplayCurrentMedia.TTL * 1000))
    let timeDifference = liveTime-cTime;
    await new Promise(resolve => setTimeout(resolve, timeDifference));
    if (!foundDisplayCurrentMedia.mediaBase){
      //get base media
      let baseMediaID = foundDisplay.baseMedia;
      //set it's id to currentMedia
      await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':baseMediaID}});
      //get TTL
      let baseMedia = await mediaModel.findById(baseMediaID);
      let baseMediaTTL = baseMedia.TTL;
      //get liveTime
      let newLiveTime = new Date(Date.now());
      await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':baseMediaID, 'currentContent.mediaBase':true, 'currentContent.liveTime':newLiveTime, 'currentContent.TTL':baseMediaTTL}});
    }
    else{
      //get the most voted media and set to current media
      let mostVoted = 0;
      let topVotes = 0
      let mediaList = foundDisplay.media;
      if (mediaList.length>0){
        //get most voted media id and ttl
        for(let i =0; i<mediaList.length; i++){
          let selectedMedia = await mediaModel.findById(mediaList[i]);
          if (selectedMedia.voteCount>topVotes){
            mostVoted = i;
            topVotes = selectedMedia.voteCount;
          }
        }
        //set current media to most voted and liveTime / ttl to most voted ones
        let mostVotedMedia = await mediaModel.findById(mediaList[mostVoted]);
        let mostVotedMediaTTL = mostVotedMedia.TTL
        let newLiveTime = new Date(Date.now());
        await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':mostVotedMedia._id, 'currentContent.mediaBase':false, 'currentContent.liveTime':newLiveTime, 'currentContent.TTL':mostVotedMediaTTL}});
      }
      //set all media votes to 0 for display
      //get each media
      for(let i =0; i<mediaList.length; i++){
        //set votes to 0
        await mediaModel.findByIdAndUpdate(mediaList[i], {$set:{voteCount:0}});
      }
      
      
    }
    let refreshedDisplay = await displayModel.findById(foundDisplay._id);
    let newMediaName;
    if (refreshedDisplay.currentContent.baseMedia){
      //get the base media name
      let baseMedia = await mediaModel.findById(refreshedDisplay.baseMedia);
      newMediaName = baseMedia.mediaName;
    }
    else{
      //get the current content media name
      let newMedia = await mediaModel.findById(refreshedDisplay.currentContent.media);
      newMediaName = newMedia.mediaName;
    }
    res.status(200).json({status:"success",display:newMediaName})
  }
  else{
    //every 250 millisecond check if media that dosent have 0 votes exists
      let loop = true;
      while(loop){
        await new Promise(resolve => setTimeout(resolve, 250));
        //loop through all media to find if any have votes != 0
        let mediaList = foundDisplay.media;
        let foundNon0 = -1;
        //get most voted media id and ttl
        for(let i =0; i<mediaList.length; i++){
          let selectedMedia = await mediaModel.findById(mediaList[i]);
          if (selectedMedia.voteCount>0){
            foundNon0 = i;
            break;
          }
        }
        if(foundNon0 != -1){
          //set current media to most voted and liveTime / ttl to most voted ones
          let mostVotedMedia = await mediaModel.findById(mediaList[foundNon0]);
          let mostVotedMediaTTL = mostVotedMedia.TTL
          let newLiveTime = new Date(Date.now());
          await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':mostVotedMedia._id, 'currentContent.mediaBase':false, 'currentContent.liveTime':newLiveTime, 'currentContent.TTL':mostVotedMediaTTL}});
          //clear all votes
          for(let i =0; i<mediaList.length; i++){
            //set votes to 0
            await mediaModel.findByIdAndUpdate(mediaList[i], {$set:{voteCount:0}});
          }
          //break loop to send response
          loop = false;
        }
        //otherwise check if current media time is up
        else if(foundNon0 == -1){
          //check if current displayed media time is up
          let foundDisplayCurrentMedia = foundDisplay.currentContent;
          const cTime = new Date(Date.now());
          let liveTime = foundDisplayCurrentMedia.liveTime;
          liveTime = new Date(liveTime);
          liveTime = new Date(liveTime.getTime() + (foundDisplayCurrentMedia.TTL * 1000))
          liveTime = liveTime - cTime;
          //if it is switch to base (set TTL to a large amount to leave display on base till vote is recorded)
          if (liveTime <= 0){
             //get base media
            let baseMediaID = foundDisplay.baseMedia;
            //set currentMediaID to baseMedia
            await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':baseMediaID}});
            //get liveTime
            let newLiveTime = new Date(Date.now());
            await displayModel.findByIdAndUpdate(foundDisplay._id, {$set:{'currentContent.media':baseMediaID, 'currentContent.mediaBase':true, 'currentContent.liveTime':newLiveTime, 'currentContent.TTL':999999999999999}});
            loop = false;
          }
        }
      }
      let refreshedDisplay = await displayModel.findById(foundDisplay._id);
      let newMediaName;
      if (refreshedDisplay.currentContent.baseMedia){
        //get the base media name
        let baseMedia = await mediaModel.findById(refreshedDisplay.baseMedia);
        newMediaName = baseMedia.mediaName;
      }
      else{
        //get the current content media name
        let newMedia = await mediaModel.findById(refreshedDisplay.currentContent.media);
        newMediaName = newMedia.mediaName;
      }
      res.status(200).json({status:"success",display:newMediaName});
  }
  res.status(200).json({status:"sucess"});
})

// @desc    get interaction history
// @route   POST /api/v2/Display/interactions
// @access  Private
// @review  Not started
const postDisplayInteractions = asyncHandler(async (req, res)=>{
  const {display, period} = req.body
  if(!display&&period){
    res.status(400).json({status:"fail", cause:"Missing information"});
    throw new Error('Missing information') 
  }
  let storeID = await storeModel.findOne({store:req.body.store, stores:{$elemMatch:req.store.id}});
  storeID = storeID._id;
  let result = await displayModel.findOne({store:storeID, displayName:display});
  let votes = [];
  if (period == 0){
    const media = result.media;
      for(let i = 0; i<media.length; i++){
        let m = await mediaModel.findById(media[i]);
        votes.push([m.mediaName, m.lifetimeVotes]);
      }
      res.status(200).json({votes});
  }
  else if (period == 1){
    const media = result.media;
    for(let i = 0; i<media.length; i++){
        let voteCount = 0;
        let m = await mediaModel.findById(media[i]);
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setHours(0);
          time.setMinutes(0);
          time.setSeconds(0);
          time.setMilliseconds(0);
          voteCount += await getVoteStats(time, m2)
        }
        votes.push([m.mediaName, voteCount]);
      }
    res.status(200).json({votes});
  }
  else if (period == 2){
    const media = result.media;
    for(let i = 0; i<media.length; i++){
        let voteCount = 0;
        let m = await mediaModel.findById(media[i]);
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setHours(time.getHours()-1);
          voteCount += await getVoteStats(time, m2)
        }
        votes.push([m.mediaName, voteCount]);
      }
    res.status(200).json({votes});
  }
  else if (period == 3){
    const media = result.media;
    for(let i = 0; i<media.length; i++){
        let voteCount = 0;
        let m = await mediaModel.findById(media[i]);
        for (let m2 of m.QR_History){
          let time = new Date(Date.now());
          time.setMinutes(time.getMinutes()-10);
          voteCount += await getVoteStats(time, m2)
        }
        votes.push([m.mediaName, voteCount]);
      }
    res.status(200).json({votes});
  }
  else{
    res.status(400).json({status:"fail",cause:"No valid time given"})
    throw new Error('No valid time given'); 
  }
})

async function getVoteStats(time, QRID){
  //for all user input where timeOfInput > current time - time
  let result = await userInput.find({QR:QRID, TimeOfInput:{$gt:time}})
  let count = 0;
  for(let i = 0; i<result.length;i++){
    count++;
  } 
  return count;
  //return count
}

// @desc    Add position
// @route   PUT /api/v2/Display/Media/Positions
// @access  Private
// @review  Complete
const putDisplayMediaPositions = asyncHandler(async (req, res)=>{
	const {QRID, position} = req.body;
    if(!QRID||!position){
      res.status(400).json({status:"fail", cause:"Missing information"});
      throw new Error('Missing information'); 
    }
	const findMedia = await media.findOne({QRID:QRID});
	if (!findMedia) {
        res.status(400).json({status:"fail", cause:"Could not find display"});
        throw new Error('Could not find display'); 
	}
	
	const xyArray = position.split(':');
    const pos = {
      x: xyArray[0],
      y: xyArray[1]
    };
	const addPosition = await media.updateOne({QRID:QRID}, {$push: {positions:pos}})
  var updateCurrentPosVal;
  if (!addPosition.currentQRPosition) {
    updateCurrentPosVal = await media.updateOne({QRID:QRID},{currentQRPosition:0});
  }
	if (!addPosition | !updateCurrentPosVal) {
        res.status(400).json({status:"fail", cause:"Failed to add position"});
        throw new Error('Failed to add position'); 
	}
	
  res.status(200).json({status:"success"});
});

// @desc    Get position
// @route   POST /api/v2/Display/Media/Positions
// @access  Private
// @review  Complete
const postDisplayMediaPositions = asyncHandler(async (req, res)=>{
	const {QRID} = req.body;
    if(!QRID){
      res.status(400).json({status:"fail", cause:"Missing information"});
      throw new Error('Missing information'); 
    }
  const findMedia = await media.findOne({QRID:QRID});
	if (!findMedia) {
        res.status(400).json({status:"fail", cause:"Could not find display"});
        throw new Error('Could not find display'); 
	}
	if (!findMedia.currentQRPosition) {
		res.status(200).json({status:"success", position:findMedia.positions[0]});
	}
	else {
    res.status(200).json({status:"success", position:findMedia.positions[findMedia.currentQRPosition]});
	}
});

// @desc    Update position
// @route   PATCH /api/v2/Display/Media/Positions
// @access  Private
// @review  Complete
const patchDisplayMediaPositions = asyncHandler(async (req, res)=>{
	const {QRID, fields, values} = req.body;
    if(!QRID){
      res.status(400).json({status:"fail", cause:"Missing information"});
      throw new Error('Missing information'); 
    }
  const findMedia = await media.findOne({QRID:QRID});
	if (!findMedia) {
        res.status(400).json({status:"fail", cause:"Could not find display"});
        throw new Error('Could not find display'); 
	}
    const farray = fields.split(',');
    const varray = values.split(',');
    let i = -1;
    for (let field of farray){
        i++;
        let value = varray[i];
        if (field == 'QRPositionAtCurrent'){
          if (!findMedia.currentQRPosition) {
            const xyArray = value.split(':');
            var positionsArray = findMedia.positions;
            let positionalVal = 0;
                  positionsArray[positionalVal].x = parseInt(xyArray[0]);
                  positionsArray[positionalVal].y = parseInt(xyArray[1]);
                const updatePositions = await media.updateOne({QRID:QRID}, {$set:{positions:positionsArray}});
            if (!updatePositions) {
                  res.status(400).json({status:"fail", cause:"Could not updated positions"});
                  throw new Error('Could not updated positions');
            }
            res.status(200).json({status:"success"});
          }
          else {
            const xyArray = value.split(':');
            let positionalVal = parseInt(findMedia.currentQRPosition);
                  positionsArray[positionalVal].x = parseInt(xyArray[0]);
                  positionsArray[positionalVal].y = parseInt(xyArray[1]);
                const updatePositions = await media.updateOne({QRID:QRID}, {$set:{positions:positionsArray}});
            if (!updatePositions) {
                  res.status(400).json({status:"fail", cause:"Could not updated positions"});
                  throw new Error('Could not updated positions');
            }
            res.status(200).json({status:"success"});
            }
        }
        else if(field == 'nextQRPosition'){
          let positionalVal = parseInt(findMedia.currentQRPosition) + 1;
          if (positionalVal < findMedia.positions.length) {
                  const updatePositions = await media.updateOne({QRID:QRID}, {$set:{currentQRPosition:positionalVal}})
            if (!updatePositions) {
                  res.status(400).json({status:"fail", cause:"Could not update to next position value"});
                  throw new Error('Could not updated positions');
            }
          }
          else {
            res.status(400).json({status:"fail", cause:"Could not update to next position value"});
            throw new Error('Could not updated positions');
          }
          res.status(200).json({status:"success"});
        }
        else if(field == 'prevQRPosition'){
          let positionalVal = parseInt(findMedia.currentQRPosition) - 1;
          if (positionalVal >= 0) {
            const updatePositions = await media.updateOne({QRID:QRID}, {$set:{currentQRPosition:positionalVal}})
          if (!updatePositions) {
            res.status(400).json({status:"fail", cause:"Could not update to prev position value"});
            throw new Error('Could not updated positions');
          }
          }
          else {
            res.status(400).json({status:"fail", cause:"Could not update to prev position value"});
            throw new Error('Could not updated positions');
          }
            res.status(200).json({status:"success"});
        }
        else if(field == 'selectPosition') {
          let potentialPosition = value;
          if (potentialPosition >= 0 && potentialPosition < findMedia.positions.length) {
            const updatePositions = await media.updateOne({QRID:QRID}, {$set:{currentQRPosition:potentialPosition}})
            if (!updatePositions) {
              res.status(400).json({status:"fail", cause:"Could not update to prev position value"});
              throw new Error('Could not updated positions');
            }
          }
          else {
            res.status(400).json({status:"fail", cause:"Could not update to selected position value"});
            throw new Error('Could not updated positions');
          }
            res.status(200).json({status:"success"});
        }
        else{
          res.status(400).json({status:"fail", cause:"Cannot update that field"});
          throw new Error('Cannot update that field'); 
        }
    }
});

// @desc    Delete position
// @route   DELETE /api/v2/Display/Media/Positions
// @access  Private
// @review  Complete
const deleteDisplayMediaPositions = asyncHandler(async (req, res)=>{
	const {QRID} = req.body;
    if(!QRID){
      res.status(400).json({status:"fail", cause:"Missing information"});
      throw new Error('Missing information'); 
    }
	const findMedia = await media.findOne({QRID:QRID});
	if (!findMedia) {
        res.status(400).json({status:"fail", cause:"Could not find display"});
        throw new Error('Could not find display'); 
	}
  var positionsArray = findMedia.positions;
  var newPositions = [];
	if (!findMedia.currentQRPosition) {
		let positionalVal = 0;
      for (let i=0; i<positionsArray.length; i++) {
        if(i != positionalVal) {
            newPositions.push(positionsArray[i]);
        }
      }
        const deletePosition = await media.updateOne({QRID:QRID}, {$set:{positions:newPositions}});
		if (!deletePosition) {
          res.status(400).json({status:"fail", cause:"Could not updated positions"});
          throw new Error('Could not updated positions');
		}
		res.status(200).json({status:"success"});
	}
	else {
		let positionalVal = parseInt(findMedia.currentQRPosition);
      for (let i=0; i<positionsArray.length; i++) {
        if(i != positionalVal) {
          newPositions.push(positionsArray[i]);
        }
      }
      if (positionalVal != 0) {
			const deletePosition = await media.updateOne({QRID:QRID}, {$set:{currentQRPosition: parseInt(positionalVal-1),positions:newPositions}});
			if (!deletePosition) {
        res.status(400).json({status:"fail", cause:"Could not updated positions"});
        throw new Error('Could not updated positions');
			}
		}
		else {
			const deletePosition = await media.updateOne({QRID:QRID}, {$set:{positions:newPositions}});
			if (!deletePosition) {
        res.status(400).json({status:"fail", cause:"Could not updated positions"});
        throw new Error('Could not updated positions');
			}
		} 	
		res.status(200).json({status:"success"});
	}
});

async function deleteAll(storeID){
  //for each display
  let displays = await displayModel.find({store:storeID});
  displays.forEach(async (display)=>{
    //for each media
    display.media.forEach(async (media)=>{
      //delete all mediaFile
      await mediaFileModel.deleteMany({media:media})
      //delete media
      await mediaModel.findByIdAndDelete(media)
    })
    //delete display
    await displayModel.findByIdAndDelete(display._id);
  })
  return true;
}
  

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
  postDisplayMediaListen,
  postDisplayInteractions,
  putDisplayMediaPositions,
  postDisplayMediaPositions,
  patchDisplayMediaPositions,
  deleteDisplayMediaPositions,
  deleteAll
}