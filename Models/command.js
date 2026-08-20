const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
  Guild: String,
  Cmds: String
})

module.exports = mongoose.model('disabledCommands', Schema)