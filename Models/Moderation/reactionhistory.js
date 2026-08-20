const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    messageId: String,
    reactionsHistory: Array,
})

module.exports = mongoose.model('reactionhistory', Schema)