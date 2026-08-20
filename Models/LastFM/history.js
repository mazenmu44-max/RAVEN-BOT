const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: String,
    pastUsernames: Array,
})

module.exports = mongoose.model('lfHistory', Schema)