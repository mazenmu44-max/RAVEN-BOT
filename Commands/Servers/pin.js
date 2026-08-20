const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'pin',
    description : 'Pin the most recent message or by URL',
    parameters : 'message',
    permissions : ['MANAGE_MESSAGES'],
    information : `${emojis.warn} Manage Messages`,
    usage : 'Syntax: pin (messagelink)',
    module : 'servers',
    run : async (client, message, args, prefix) => {
        if (!args[0]) {
            const messages = await message.channel.messages.fetch({ limit: 2 })
            messages.forEach((msg) => { if (msg.id === message.id) { return; } else { msg.pin() } })
        } else {
            if (!args[0].startsWith(`https://discord.com/channels/`)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid **message link**`).setColor(colors.warn)] })
            if (!args[0].startsWith(`https://discord.com/channels/${message.guild.id}/${message.channel.id}`)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: That message is not in this channel`).setColor(colors.warn)] })
            const arg = args[0].replace(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/`, '')
            message.channel.messages.fetch(arg).then((msg) => { if (msg) { msg.pin() } else { return; }})
        }
    },
};