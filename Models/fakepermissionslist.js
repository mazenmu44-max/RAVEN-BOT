const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId: String,
    guildData: Array
})

module.exports = mongoose.model('fakepermissionslist', Schema)