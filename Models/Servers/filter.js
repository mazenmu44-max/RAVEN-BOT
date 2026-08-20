const mongoose = require('mongoose')

const filter = new mongoose.Schema({
    guild : String,
    filteredWords : Array
})

module.exports = mongoose.model('filters', filter)