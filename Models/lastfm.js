const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  userID: String,
  lname: Array,
})

module.exports = mongoose.model('lastfmUsers', Schema)