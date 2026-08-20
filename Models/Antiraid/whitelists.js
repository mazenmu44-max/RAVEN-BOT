const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guild : String,
    whitelistedUsers : Array
})

module.exports = mongoose.model('antiraid_whitelists', schema)