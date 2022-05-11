const mongoose = require('mongoose')

const userInputSchema = mongoose.Schema(
  {
    QR: {
      //type: mongoose.Schema.Types.ObjectId,
	  type: String,
      required: true,
      ref: 'User',
    },
    UserIdentifier: {
      type: String,
      required: [true, 'Please add identifier'],
    },
    TimeOfInput: {
      type: Date,
      required: [true, 'Please add time of input'],
    }
  }
)

module.exports = mongoose.model('UserInput', userInputSchema)