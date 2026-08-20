const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    substring : String,
    message : Object,
    logChannel : String,
    awardChannel : String,
    awardRoles : Array,
})

module.exports = mongoose.model('vanity_dev', Schema)