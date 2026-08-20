const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    errorToken: String,
    errorText: String,
    errorCommand: String,
    errorAuthor: String,
    errorAuthorId: String,
    errorGuild: String,
    errorGuildId: String,
    errorChannel: String,
    errorChannelId: String,
})

module.exports = mongoose.model('errors', Schema)