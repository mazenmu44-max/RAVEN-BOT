const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    messageId: String,
})

module.exports = mongoose.model('ce', Schema)