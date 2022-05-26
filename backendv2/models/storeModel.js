const mongoose = require('mongoose')

const storeSchema = mongoose.Schema(
  {
	store: {
		type: String,
		required: [true, 'Please add name'],
	},
    company: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'Please add company'],
    },
	accounts: {
		type: Array,
		required: false
	},
	ID: {
		type: Number,
		required: true
	}
  }
)

module.exports = mongoose.model('Store', storeSchema)