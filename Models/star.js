const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    message: String,
})
module.exports = mongoose.model('star', Schema)