const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    channel : String,
    message : String,
})

module.exports = mongoose.model('stick', Schema)