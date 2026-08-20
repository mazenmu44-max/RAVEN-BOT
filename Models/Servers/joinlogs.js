const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guild : String,
    channel : String
})

module.exports = mongoose.model('joinlogs', schema)