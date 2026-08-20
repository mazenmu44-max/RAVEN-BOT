const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    message : String,
    pages : Array
})

module.exports = mongoose.model('paginations', Schema)