const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    guildId: String,
    role: String,
    role_punishment: String,
    role_threshold: String,
    role_command: String,
    channel: String,
    channel_punishment: String,
    channel_threshold: String,
    emoji: String,
    emoji_punishment: String,
    emoji_threshold: String,
    ban: String,
    ban_punishment: String,
    ban_threshold: String,
    ban_command: String,
    kick: String,
    kick_punishment: String,
    kick_threshold: String,
    kick_command: String,
    webhook: String,
    webhook_punishment: String,
    webhook_threshold: String,
    botadd: String,
    botadd_punishment: String,
    vanity: String,
    vanity_punishment: String,
    vanity_url: String,
})

module.exports = mongoose.model('antinukes', Schema)