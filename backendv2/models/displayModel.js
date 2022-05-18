const mongoose = require('mongoose')
const { stringify } = require('uuid')

const displaySchema = mongoose.Schema(
  {
	displayName: {
	  type: String,
	  required: [true, 'Please add name'],
	},
    store: {
	  type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please add store'],
    },
	settings: {
	  type: Array,
	  required: false
	},
	media: {
		type: Array,
		required: false
	},
    currentContent:{
		media:{
			type:String,
			required:false,
		},
		mediaBase:{
			type:String,
			required:false,
		},
		liveTime:{
			type:Date,
			required:false,
		},
		TTL:{
			type:Number,
			required:false,
		},
	},
    displayType:{
		type: String,
		required: [true, "please add display type"]
	},
	location:{
		type: String,
		required: [true, "please add location"]
	},
	baseMedia:{
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	}
  }
)

module.exports = mongoose.model('Display', displaySchema)