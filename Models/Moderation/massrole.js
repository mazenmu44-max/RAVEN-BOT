const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    check : String,
    type : String,
    role : String,
    totalAdded : Number
})

module.exports = mongoose.model('massroles', Schema)