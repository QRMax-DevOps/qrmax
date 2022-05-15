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
		type:Object,
		required:false
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
		type:Object,
		required: false
	}
  }
)

module.exports = mongoose.model('Display', displaySchema)