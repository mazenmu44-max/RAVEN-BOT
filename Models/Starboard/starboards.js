const mongoose = require('mongoose');
const starboardSchema = new mongoose.Schema({ 
    guild : String,
    locked : Boolean,
    selfstar : Boolean,
    timestamp : Boolean,
    emoji : String,
    whitelistedRoles : Array,
    channel : String,
    threshold : Number,
    jumpurl : Boolean,
    color : String,
    attachments : Boolean,
    ignoredChannels : Array,
});
module.exports = mongoose.model('starboards', starboardSchema);