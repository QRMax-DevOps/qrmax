const mongoose = require('mongoose')

const mediaFileSchema = mongoose.Schema(
  {
	  mediaID: {
	    type: mongoose.Schema.Types.ObjectId,
	    required: false,
	  },
    chunkNumber:{
        type:Number,
        required:false,
    },
    data: {
	  type: String,
      required: false,
    }
  }
)

module.exports = mongoose.model('mediaFile', mediaFileSchema)