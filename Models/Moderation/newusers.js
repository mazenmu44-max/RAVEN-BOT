const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    user : String,
    timestamp : String
})

module.exports = mongoose.model('newusers', Schema)