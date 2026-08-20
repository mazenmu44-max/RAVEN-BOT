const emojis = require('../../Data/emojis.json')
const config = require('../../Data/config.json')

module.exports = {
    name : 'warn',
    description : 'Warns the mentioned user and private messages them the warning',
    parameters: 'member, reason',
    permissions: ['MANAGE_MESSAGES'],
    information: `${emojis.warn} Manage Messages`,
    usage: `Syntax: warn (member) <reason>\nExample: warn ${config.ownerTag} Being mean`,
    module: 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Warn
     */

    run : async (client, message, args) => {
        const helpWarn = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle('Command: warn').setDescription(`Warns the mentioned user and private messages them the warning\`\`\`Syntax: warn (member) <reason>\nExample: warn ${config.ownerTag} Being mean\`\`\``).setColor('#718090')
        if (!args[0]) return message.channel.send({ embeds: [helpWarn] })
        const member = message.mention.member.first() || message.guild.members.cache.get(args[0])
        const noMember = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a member with the name: **${args.slice(0).join(' ')}**`).setColor(colors.color)
        if (!member) return message.channel.send({ embeds: [noMember] })
        let reason = args.slice(1).join(' ')
        if (!reason) reason = 'No reason provided'
        try {
            message.author.send('you were warned')
        } catch (error) {
            
        }
    },
};