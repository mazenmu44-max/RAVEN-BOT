const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    enabled : Boolean,
    unpin : Boolean,
    channel : String,
})

module.exports = mongoose.model('pins', Schema)