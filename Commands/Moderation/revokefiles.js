const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')

module.exports = {
    name : 'revokefiles',
    description : 'Removes/assigns the permission to attach files & embed links in the current channel',
    permissions : ['MANAGE_CHANNELS'],
    information : `${emojis.warn} Manage Channels`,
    usage : 'Syntax: revokefiles <on or off> (channel)\nExample: revokefiles on #general',
    module: 'moderation',
    pages : [
        {
            name : 'revokefiles off',
            description : 'Disables permissions to attach files & embed links in a channel',
            parameters: 'channel',
            information: `${emojis.warn} Manage Channels`,
            usage: `Syntax: revokefiles off <channel>\nExample: revokefiles off #general`,
        },
        {
            name : 'revokefiles on',
            description : 'Enable permissions to attach files & embed links in a channel',
            parameters: 'channel',
            information: `${emojis.warn} Manage Channels`,
            usage: `Syntax: revokefiles on <channel>\nExample: revokefiles on #general`,

        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Revokefiles
     */

    run : async (client, message, args) => {
        
        const subCommands = ['on', 'off']
        const parameter = args[0]

        const helpRevokefiles = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: revokefiles').setDescription(`Removes/assigns the permission to attach files & embed links in the current channel\`\`\`Syntax: revokefiles <on or off> (channel)\nExample: revokefiles on #general\`\`\``).setColor('#718090')
        if (!parameter || !subCommands.includes(parameter.toLowerCase())) return message.channel.send({ embeds: [helpRevokefiles] })

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((c) => c.name.startsWith(args[1])) || message.channel;
        if (parameter.toLowerCase() === 'on') {
            channel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { EMBED_LINKS: false, ATTACH_FILES: false })
            const revokedFiles = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Revoked **attach files** & **embed links** for @everyone`).setColor(colors.approve)
            message.channel.send({ embeds: [revokedFiles] })
        }
        if (parameter.toLowerCase() === 'off') {
            channel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { EMBED_LINKS: true, ATTACH_FILES: true })
            const revokedFiles = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Assigned **attach files** & **embed links** permission for @everyone`).setColor(colors.approve)
            message.channel.send({ embeds: [revokedFiles] })
        }
    },
};