const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  _id: String,
  entries: [{
    text: String,
    date: {type: Date, default: Date.now},
    sentiment: Number
  }],
  oneTimeToken: String,
})

exports.UserModel = mongoose.model('User', UserSchema)
