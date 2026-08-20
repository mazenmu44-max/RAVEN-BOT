const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    server : String,
    customer : String,
    payment: String
})

module.exports = mongoose.model('servers', Schema)