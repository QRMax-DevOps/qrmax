const mongoose = require('mongoose')

const storeAccountSchema = mongoose.Schema({
	username: {
    type: String,
    required: [true, 'Please add username'],
	},
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add company'],
  },
  salt: {
    type: String,
    required: [true, 'Please add salt'],
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
  },
	stores: {
    type: Array,
    required: false
	},
  settings: {
    type: Array,
    required: false
	}
})

module.exports = mongoose.model('StoreAccount', storeAccountSchema)