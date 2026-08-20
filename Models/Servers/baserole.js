const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId: String,
    baseroleId: String,
})

module.exports = mongoose.model('baseroles', Schema)