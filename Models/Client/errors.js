const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    client : String,
    message : String,
    command : String,
    error : String,
    number : String,
})

module.exports = mongoose.model('trace', Schema)