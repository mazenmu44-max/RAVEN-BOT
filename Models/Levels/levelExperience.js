const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: String,
    guildId: String,
    xp: String
})

module.exports = mongoose.model('levelExperience', Schema)