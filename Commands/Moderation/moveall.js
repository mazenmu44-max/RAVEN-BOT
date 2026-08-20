const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')

module.exports = {
    name : 'moveall',
    description : 'Move all members in current channel to another channel',
    parameters : 'channel',
    permissions : 'ADMINISTRATOR',
    information : `${emojis.cooldown} 10 seconds\n${emojis.warn} Administrator`,
    usage : 'Syntax: moveall <voice channel>\nExample: moveall 799824066814541884',
    module : 'moderation',

    run : async (client, message, args) => {
        if (!args[0]) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Mention a **voice channel** to drag all members to`).setColor(colors.warn)] })
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.includes(args[0]))
        if (!channel || channel.type !== 'GUILD_VOICE') return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[0]}**`).setColor(colors.warn)] })
        if (!message.member.voice.channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're not connected to a **voice channel**`).setColor(colors.warn)] })
        message.guild.members.cache.forEach((member) => {
            if (member.voice.channel) {
                member.voice.setChannel(channel.id)
            }
        })
        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Moved all members to **${channel.name}**`).setColor(colors.approve)] })
    }
}