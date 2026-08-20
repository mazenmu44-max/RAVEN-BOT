const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guildId: String,
  guildData: Array,
})

module.exports = mongoose.model('antinuke_lists', Schema)