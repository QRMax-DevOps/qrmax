let Media;

class MediaDAO {
    static async injectDB(conn) {
        if (Media) {
          return;
        }
        try {
            Media = await conn.db(process.env.QRMAX_NS).collection("Media");
        } catch (e) {
          console.error(
            'unable to establish a collection handle in MediaDAO" ${e}'
          );
        }
    }

    static async newMedia(mediaID, mediaFile){
    //generate display id
      const registerDoc = {
        ID: mediaID,
        mediaFile: mediaFile
      }
      //insert doc
      try{
        Media.insertOne(registerDoc)
      }
      catch(e){
        console.error('unable to add new Media:' + e)
      }
    }

    static async retrieveMedia(mediaID){
        const result = await Media.findOne({
            ID:mediaID
        },
        {
            projection:{
                _id:0, ID:0
            }  
        })
        return result;
    }

    static async deleteMedia(mediaID){
      Media.deleteOne({ ID:mediaID })
    }
}

module.exports = MediaDAO;