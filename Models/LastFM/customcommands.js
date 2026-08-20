const mongoose = require('mongoose')
const customcommands = new mongoose.Schema({ guild : String, user : String, command : String, public : Boolean, disabled : Boolean })
module.exports = mongoose.model('lastfm-customcommands', customcommands)