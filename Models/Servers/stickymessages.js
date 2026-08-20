const mongoose = require('mongoose');

const stickyMessageSchema = new mongoose.Schema({
    guild : String,
    stickyMessages : Array
});

module.exports = mongoose.model('stickymessages', stickyMessageSchema);