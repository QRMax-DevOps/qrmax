const mongoose = require('mongoose')

const mediaSchema = mongoose.Schema(
  {
	display: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'please provide display reference']
	},
	QRID: {
	  type: String,
	  required: false,
	},
    QR_History: {   
	  type: Array,
      required: false,
    },
	mediaName: {
	  type: String,
	  required: false
	},
    mediaFileChunks: {
        type: Number,
        required:false
    },
    voteCount:{
		type:Number,
		required:false
	},
    lifetimeVotes:{
		type: Number,
		required: false
	},
	TTL:{
		type: Number,
		required: false
	}
  }
)

module.exports = mongoose.model('media', mediaSchema)