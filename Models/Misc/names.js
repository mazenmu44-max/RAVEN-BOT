const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    user : String,
    names : Array,
})

module.exports = mongoose.model('names', Schema)