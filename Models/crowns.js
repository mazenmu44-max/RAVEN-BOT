const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildId: String,
    userTag: String,
    userId: String,
    artistName: String,
    userPlays: String,
})

module.exports = mongoose.model('last.fm_crowns', Schema)