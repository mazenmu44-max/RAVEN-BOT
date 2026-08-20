const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId: String,
    userId: String,
    roleId: String,
})

module.exports = mongoose.model('boosterroles', Schema)