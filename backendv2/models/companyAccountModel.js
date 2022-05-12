const mongoose = require('mongoose')

const companyAccountSchema = mongoose.Schema(
  {
    company: {
	  type: String,
      required: [true, 'Please add company name'],
    },
    salt: {
      type: String,
      required: [true, 'Please add salt'],
    },
    password: {
      type: String,
      required: [true, 'Please add password'],
    },
    settings:{
      type:Array,
      required: [true, 'please add settings array']
    }
  }
)

module.exports = mongoose.model('CompanyAccount', companyAccountSchema)