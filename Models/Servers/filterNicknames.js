const mongoose = require('mongoose')

const filter = new mongoose.Schema({
    guild : String,
    enabled : Boolean,
    ignoredRoles : Array
})

module.exports = mongoose.model('filterNicknames', filter)