const { string, boolean } = require('mathjs')
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
			type:mongoose.Schema.Types.ObjectId,
			required:false,
		},
		mediaBase:{
			type:Boolean,
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
	lat:{
		type: Number,
		required: [true, "please add lat"]
	},
	lon:{
		type: Number,
		required: [true, "please add lon"]
	},
	baseMedia:{
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	}
  }
)

module.exports = mongoose.model('Display', displaySchema)