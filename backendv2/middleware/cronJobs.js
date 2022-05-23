const cron = require('node-cron');
const mediaModel = require('../models/mediaModel');
const UserInput = require('../models/userInputModel')
const { v4: uuidv4 } = require('uuid');

function refreshAllQR(){
   cron.schedule('* */30 * * * *', async function(){
       //get list of all media
        let mediaList = await mediaModel.find();
        //for each media
        mediaList.forEach(async(media)=>{
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
            let currentQR = media.QRID;
            await mediaModel.findByIdAndUpdate(media._id, {$set:{QRID:cleanQRID}, $push:{QR_History:currentQR}})
       })
   })
};

function deleteAllUserInput(){
    cron.schedule('0 0 0 * * *', async function(){
        await UserInput.remove()
    });
}

module.exports = {
    refreshAllQR,
    deleteAllUserInput
}