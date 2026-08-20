const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guildId: String,
  memberId: String
})

module.exports = mongoose.model('antinuke_admins', Schema)