const player = require("../../Functions/player");
const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
module.exports = {
    name: "skip",
    description: "skip the current song",
    run: async (client, message, args) => {
        const queue = player.getQueue(message.guild);
        if (!queue?.playing) return
        await queue.skip();
        message.react(`⏭️`)
    },
};