const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    prefix : String
})

module.exports = mongoose.model('prefixes', Schema)