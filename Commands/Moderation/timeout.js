const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')
const prettyms = require('pretty-ms')
module.exports = {
    name : 'timeout',
    description : 'Mutes the provided member using Discords timeout feature',
    parameters : 'member, duration, reason',
    permissions : ['TIMEOUT_MEMBERS'],
    information : `${emojis.warn} Moderate Members`,
    usage : `Syntax: timeout (member) <duration> <reason>\nExample: timeout ${config.ownertag} 1m bad boy`,
    module : 'moderation',
    run : async (client, message, args) => {
        if (!args[0]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: timeout').setDescription(`Mutes the provided member using Discords timeout feature\`\`\`Syntax: timeout (member) <duration> <reason>\nExample: timeout ${config.ownertag} 1m bad boy\`\`\``).setColor(colors.help)] })
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.includes(args[0]))
        if (!member) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a member with the name: **${args[0]}**`).setColor(colors.warn)] })
        if (!args[1] || !ms(args[1])) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing **duration** to set for member`).setColor(colors.warn)] })
        if (member.user.id === client.user.id) return message.channel.send('leave me alone')
        if (member.user.id === message.author.id) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **timeout** yourself.`).setColor(colors.deny)] })
        if (member.user.id === message.guild.ownerId) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **timeout** the **owner**.`).setColor(colors.deny)] })
        if (message.member.roles.highest.position == member.roles.highest.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **timeout** someone who has the same **top role** as you.`).setColor(colors.deny)] })
        if (message.member.roles.highest.position < member.roles.highest.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **timeout** someone who is **higher** than you.`).setColor(colors.deny)] })
        if (ms(args[1]) > ms('28d')) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: **Duration** cannot exceed **28 days**`).setColor(colors.deny)] })
        if (!member.manageable) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing permissions to **timeout** the user, make sure I have the **Moderate Members** permission`).setColor(colors.warn)] })
        const reason = args.slice(2).join(' ') || 'No reason provided'
        await member.timeout(ms(args[1]), [`User Responsible: ${message.author.tag} / ${reason}`]).then(() => {
            const longtime = prettyms(ms(args[1]), {verbose: true}); message.channel.send({ embeds : [new MessageEmbed().setDescription(`${message.author}: **${member.user.tag}** is now timed out for **${longtime}**`).setColor('#ff0000')] })
        })
    }
}