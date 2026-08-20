const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild: String,
    channel: String,
    interval: String,
    message: String
})

module.exports = mongoose.model('automessages', Schema)