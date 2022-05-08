const mongoose = require('mongoose')

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
	currentPosition: {
	  type: Number,
	  required: false
	}
  }
)

module.exports = mongoose.model('Display', displaySchema)