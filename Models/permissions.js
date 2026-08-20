const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guildId: String,
  permission: String,
  type: String
})

module.exports = mongoose.model('antinuke_permissions', Schema)