const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    channel : String,
    command : String,
})

module.exports = mongoose.model('commands', Schema)