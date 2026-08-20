const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    owner: String,
    channel: String,

})

module.exports = mongoose.model('voicemasters', Schema)