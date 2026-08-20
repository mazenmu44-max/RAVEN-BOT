const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId : String,
    channel : String,
    category : String,
    default_category : String,

})

module.exports = mongoose.model('VoiceMaster_Configurations', Schema)