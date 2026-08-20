const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId: String,
    channel: String,
})

module.exports = mongoose.model('jails', Schema)