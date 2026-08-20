const mongoose = require('mongoose');

const prefix = mongoose.model('prefix', new mongoose.Schema({ guild: String, prefix: String }) );

const reactionrole = mongoose.model('reactionroles', new mongoose.Schema({ guild : String, message : String, channel : String, reactionroles : Array }))

const tags = mongoose.model('tags', new mongoose.Schema({ guild : String, tags : Array }))

const vanity = mongoose.model('vanity', new mongoose.Schema({ guild : String, awardchannel : String, logchannel : String, substring : String, message : Object, roles : Array }))

const ownerShit = mongoose.model('ownerShit', new mongoose.Schema({ client : String, errors : Array }))

const webhooks = mongoose.model('webhooks', new mongoose.Schema({ guild : String, webhooks : Array }))

const snipes  = mongoose.model('snipes', new mongoose.Schema({ guild : String, channel : String, snipes : Array }))

const welcomes = mongoose.model('welcomes', new mongoose.Schema({ guild : String, welcomes : Array }))

module.exports = { prefix, reactionrole, tags, ownerShit, webhooks, welcomes };