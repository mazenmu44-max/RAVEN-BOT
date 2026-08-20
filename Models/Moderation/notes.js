const mongoose = require('mongoose')

const notes = new mongoose.Schema({ guild : String, member: String, notes: Array });

module.exports = mongoose.model('notes', notes)