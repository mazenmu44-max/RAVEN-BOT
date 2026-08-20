const config = require('../../Data/config.json')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'rename',
    description : 'Assign the mentioned member a new',
    aliases : ['nick', 'nickname'],
    parameters : 'member, newnick',
    information : `${emojis.warn} Manage Nicknames`,
    usage : `Syntax: rename (member) <new nick>\nExample: rename ${config.ownertag} jonathan`,
    module : 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Rename
     */

    run : async (client, message, args) => {
        const parameter = args[0]
        const newnick = args.slice(1).join(' ')
        const owner = await message.guild.fetchOwner()
        const helpRename = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle('Command: rename').setDescription(`Assigns the mentioned user a new nickname in the guild\`\`\`Syntax: rename (member) <new nick>\nExample: rename ${config.ownertag} jonathan\`\`\``).setColor(colors.help)
        if (!parameter) return message.channel.send({ embeds : [helpRename] })
        const member = message.guild.members.cache.get(parameter) || message.mentions.members.first() || message.guild.members.cache.find((m) => m.user.username.toLowerCase().startsWith(parameter.toLowerCase()) || m.user.tag.toLowerCase().startsWith(parameter.toLowerCase()) || m.displayName.toLowerCase().startsWith(parameter.toLowerCase()))
        const noMember = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a member with the name: **${parameter}**`).setColor(colors.warn)
        if (!member) return message.channel.send({ embeds : [noMember] })
        const tooHigh = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **rename** someone who is **higher** than you.`).setColor(colors.deny)
        if (message.author.id !== member.user.id && message.author.id !== owner.user.id && member.roles.highest.position > message.member.roles.highest.position) return message.channel.send({ embeds : [tooHigh] })
        const topRole = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **rename** someone who has the same **top role** as you.`).setColor(colors.deny)
        if (message.author.id !== member.user.id && message.author.id !== owner.user.id && member.roles.highest.position == message.member.roles.highest.position) return message.channel.send({ embeds : [topRole] })
        const cantRename = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't **rename** the **owner**.`).setColor(colors.deny)
        if (message.author.id !== owner.user.id && owner.user.id === member.user.id) return message.channel.send({ embeds : [cantRename] })
        if (newnick) {
            const tooLong = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Name cannot exceed **32 characters**!`).setColor(colors.warn)
            if (newnick.length > 32) return message.channel.send({ embeds : [tooLong] })
            await member.setNickname(newnick)
            const setNickname = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Changed **${member.user.username}**'s nickname to \`${newnick}\``).setColor(colors.approve)
            return message.channel.send({ embeds : [setNickname] })
        } else if (!newnick) {
            await member.setNickname(member.user.username)
            const removedNickname = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Reset **${member.user.tag}** nickname`).setColor(colors.approve)
            return message.channel.send({ embeds : [removedNickname] })
        }
    },
};