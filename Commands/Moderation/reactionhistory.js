const reactionhistorySchema = require('../../Models/Moderation/reactionhistory')
const pagination = require('../../Functions/pagination')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'reactionhistory',
    description : 'See logged reactions for a message',
    aliases : ['rh'],
    parameters : 'messagelink',
    permissions : ['MANAGE_MESSAGES'],
    information: `${emojis.warn} Manage Messages`,
    usage : `Syntax: reactionhistory <message link>\nExample: reactionhistory discordapp.com/channels/...`,
    module : 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Reactionhistory
     */

    run:  async (client, message, args) => {
        try {
            const messageLink = args[0]
            const helpReactionhistory = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle('Command: reactionhistory').setDescription(`See logged reactions for a message\`\`\`Syntax: reactionhistory <message link>\nExample: reactionhistory discordapp.com/channels/...\`\`\``).setColor('#718090')
            if (!messageLink) return message.channel.send({ embeds: [helpReactionhistory] })
            let foundStatus = false
            message.guild.channels.cache.forEach(async (fetchedChannel) => {
                if (fetchedChannel.type === 'GUILD_TEXT') {
                    const fetchedMessages = await fetchedChannel.messages.fetch({ limit: 100 })
                    fetchedMessages.forEach(async (msg) => {
                        if (msg.url === messageLink) {
                            foundStatus = true
                            const reactionhistoryData = await reactionhistorySchema.findOne({
                                messageId: msg.id
                            });
                            if (!reactionhistoryData || reactionhistoryData.reactionsHistory.length < 0) return message.channel.send({
                                embeds: [new MessageEmbed({
                                    description: `:mag_right: ${message.author}: No reactions logged for [**message**](${messageLink}) provided`,
                                    color: '#7189da'
                                })]
                            });
                            const reactionhistoryPages = [];
                            let reactionhistoryIndex = 0;
                            let reactionhistoryItems = 0;
                            let reactionHistory = reactionhistoryData.reactionsHistory.pager(10);
                            reactionHistory.forEach((item) => {
                                item.forEach(() => ++reactionhistoryItems);
                            });
                            reactionHistory.forEach((item) => {
                                let reactionhistoryMapped = item.map((reaction) => {
                                    ++reactionhistoryIndex
                                    return `\`${reactionhistoryIndex}\` ${reaction.reaction} ${reaction.type === 'add' ? 'added' : 'removed'} by **${reaction.author}** `
                                }).join("\n");
                                const reactionhistoryEmbed = new MessageEmbed()
                                .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setTitle(`Reaction history`)
                                .setColor(message.member.displayHexColor)
                                    .setDescription(reactionhistoryMapped)
                                reactionhistoryPages.push(reactionhistoryEmbed);
                            });
                            if (reactionhistoryPages.length > 1) {
                                await pagination(message, reactionhistoryPages, reactionHistory.length, reactionhistoryItems);
                            } else {
                                return message.channel.send({
                                    embeds: [reactionhistoryPages[0]]
                                });
                            }
                        }
                    })
                }
            })
        } catch (error) {
                return console.log(error)
        }
    }
}
//if (!foundStatus) {
    //const invalidMessage = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid **message link** provided`).setColor(colors.warn)
    //return message.channel.send({ embeds: [invalidMessage] })
//}