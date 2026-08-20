const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  userId: String,
  userData: Array,
})

module.exports = mongoose.model('reminders', Schema)