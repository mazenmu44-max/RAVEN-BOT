const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    message : String,
    self_destruct : Number,
    channel : String
})

module.exports = mongoose.model('wlc', Schema)