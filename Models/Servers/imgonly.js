const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guild : String,
    channels : Array
})

module.exports = mongoose.model('imgonly', schema)