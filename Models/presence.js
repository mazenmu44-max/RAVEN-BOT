const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    member : String
})

module.exports = mongoose.model('presence', Schema)