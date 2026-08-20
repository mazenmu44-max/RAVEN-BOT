const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user : String,
    location : String,
})

module.exports = mongoose.model('timezones', schema)