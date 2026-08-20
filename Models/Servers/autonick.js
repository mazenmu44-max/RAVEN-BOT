const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    nickname : String
})

module.exports = mongoose.model('autonicks', Schema)