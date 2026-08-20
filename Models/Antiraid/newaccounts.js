const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guild : String,
    punishment : String,
    threshold : Number
})

module.exports = mongoose.model('antiraid_newaccounts', schema)