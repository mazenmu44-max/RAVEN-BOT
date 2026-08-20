const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
const { Database } = require('quickmongo');
const modlog = new Database(config.mongoURI, `modlogDatabase`);

module.exports = {
    name : 'unban',
    description : 'Unbans the mentioned user from the guild',
    parameters : 'user, reason',
    information : `${emojis.warn} Ban Members\n:notepad_spiral: Generates one-time use invite for member`,
    usage : `Syntax: unban (user) <reason>\nExample: unban ${config.ownertag} Forgiven`,
    module : 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Unban
     */

    run : async (client, message, args) => {
        const parameter = args[0]
        const helpUnban = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle('Command: unban').setDescription(`Unbans the mentioned user from the guild\`\`\`Syntax: unban (user) <reason> --params\nExample: unban ${config.ownertag} Forgiven --reinvite\`\`\``).setColor(colors.help)
        if (!parameter) return message.channel.send({ embeds: [helpUnban] })
        let params = []
        let found = false
        let cancel = false
        args.forEach((arg) => {
            if (found) return;
            if (arg.startsWith('--reinvite')) {
                found = true
                params.push('true')
            }
        })
        let reason = args.slice(1).join(' ')
        reason = reason.replace('--reinvite', '')
        if (!reason) reason = 'No reason provided'
        message.guild.bans.fetch().then(async bans => {
            const banned = bans.find(ban => ban.user.id === parameter || ban.user.username.includes(parameter));
            if (banned) {
                message.guild.members.unban(banned.user.id, reason)
                const invite = await message.channel.createInvite({ maxAge: 7200, maxUses: 1 })
                const unbannedEmbed = new MessageEmbed().setTitle('Unbanned').addField(`**You have been unbanned in**`, `${message.guild.name}`, true).addField(`**Moderator**`, `${message.author.tag}`, true)
                params.length > 0 ? unbannedEmbed.addField(`**Invite Link**`, `https://discord.gg/${invite.code}`, true) : null
                unbannedEmbed.addField(`**Reason**`, `${reason}`, true).setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setColor('#39c672').setTimestamp()
                try {
                    await banned.user.send({ embeds: [unbannedEmbed] })
                } catch (error) {
                    cancel = true
                    message.channel.send(`:thumbsup: - couldn't pm **${banned.user.tag}**`)
                }
                if (!cancel) message.channel.send(`:thumbsup:`)
                const noJaillog = new MessageEmbed()
                .setDescription(`${emojis.warn} ${message.author}: \`#jail-log\` was **not found** - set it using \`,settings jaillog (channel)\``)
                .setColor(colors.warn)
                return message.channel.send({ embeds: [noJaillog] })
            } else {
                const notFound = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: Couldn't find a ban for: **${parameter}**`).setColor(colors.deny)
                return message.channel.send({ embeds: [notFound] })
            }
        })
    },
};