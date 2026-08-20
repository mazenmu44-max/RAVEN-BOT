const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    autoroles : Array
})

module.exports = mongoose.model('autoroles', Schema)