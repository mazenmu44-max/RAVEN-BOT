const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guildId: String,
    role: String,
    permission: String,
})

module.exports = mongoose.model('fakepermissions', Schema)