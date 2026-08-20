const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    command : String,
    client : String,
    uses : Number,
})

module.exports = mongoose.model('TopCmds', Schema)