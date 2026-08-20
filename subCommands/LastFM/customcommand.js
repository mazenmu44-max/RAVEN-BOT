const { MessageEmbed } = require('discord.js')
const customcommands = require('../../Models/LastFM/customcommands')
const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const pagination = require('../../Functions/pagination')
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns Last.fm Customcommand
 */

const customcommand = async (client, message, args) => {
    if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: lastfm customcommand').setDescription(`Set your own custom Now Playing command\`\`\`Syntax: lastfm customcommand (substring)\nExample: lastfm customcommand nickfm --public\`\`\``).setColor('#718090')] })

    if (args[1] == 'blacklist' || args[1] === 'bl') {
        if (!args[2]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: lastfm customcommand blacklist').setDescription(`Blacklist users their own Now Playing command\`\`\`Syntax: lastfm customcommand blacklist (member)\nExample: lastfm customcommand blacklist ${config.ownertag}\`\`\``).setColor('#718090')] })
    } else if (args[1] === 'public') {
        if (!args[2]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: lastfm customcommand public').setDescription(`Toggle public flag for a custom command\`\`\`Syntax: lastfm customcommand public (cmd)\nExample: lastfm customcommand public nickfm\`\`\``).setColor('#718090')] })
        await customcommands.findOne({ guild : message.guild.id, command : args[2] }).then(async(data) => {
            if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: \`${args[2]}\` is not an existing **Now Playing** command`).setColor(colors.warn)] })
            if (data.public === true) {
                await customcommands.findOneAndUpdate({ guild : data.guild, command : data.command, public : data.public }, { guild : data.guild, command : data.command, public : false }).then(async() => {
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set \`${data.command}\` (**${client.users.cache.get(data.user).tag}**) public flag to **False**`).setColor(colors.approve)] })
                })
            } else if (data.public === false) {
                await customcommands.findOneAndUpdate({ guild : data.guild, command : data.command, public : data.public }, { guild : data.guild, command : data.command, public : true }).then(async() => {
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set \`${data.command}\` (**${client.users.cache.get(data.user).tag}**) public flag to **True**`).setColor(colors.approve)] })
                })
            }
        })
    } else if (args[1] === 'remove') {
        if (!args[2]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: lastfm customcommand remove').setDescription(`Remove a custom command for a member\`\`\`Syntax: lastfm customcommand remove (member)\nExample: lastfm customcommand remove ${config.ownertag}\`\`\``).setColor('#718090')] })
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.guild.members.cache.find((m) => m.displayName.includes(args[2]) || m.user.username.includes(args[2]) || m.user.tag.inclues(args[2]))
        if (!member) return message.channel.send({ embeds : [new MessageEmbed(`${emojis.warn} ${message.author}: I was unable to find that **member** or the **ID** is invalid`).setColor(colors.warn)] })
        await customcommands.findOne({ guild : message.guild.id, user : member.user.id }).then(async(data) => {
            if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${member} doesn't have a **Now Playing** command set`).setColor(colors.warn)] })
            await customcommands.findOneAndRemove({ guild : message.guild.id, user : member.user.id }).then(async() => {
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed **${member.user.tag}**'s custom **Now Playing** command`).setColor(colors.approve)] })
            })
        })
    } else if (args[1] === 'list') {
        const cc = await customcommands.find({ guild: message.guild.id });
        let array = []
        cc.forEach((customcommand) => { array.push({ command : customcommand.command, author : customcommand.user })})
        if (!cc || array.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author}: No **Custom Now Playing Commands** found`).setColor('#7189da')] })
        const customcommandPages = [];
        let customcommandIndex = 0;
        const customcommandPager = array.pager(10);
        customcommandPager.forEach((page) => {
            const items = page.map((customcommand) => { return `\`${++customcommandIndex}\` ${customcommand.command} - **${client.users.cache.get(customcommand.author).tag}** (\`${customcommand.author}\`)`; }).join('\n');
            customcommandPages.push(new MessageEmbed().setAuthor({ name : message.member.displayName, iconURL : message.author.displayAvatarURL({ dynamic: true }) }).setTitle('Custom Commands').setColor(message.member.displayHexColor).setDescription(items).setFooter({ text : `Page 1/1 (${customcommandPages === 1 ? 'entry' : 'entries'})` }))
        });
        if (customcommandPages.length > 1) { await pagination(message, customcommandPages, customcommandPager.length, customcommandIndex, ` (${customcommandIndex} ${customcommandIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [customcommandPages[0]] }); }
    } else {
        if (args[1] === 'none') {
            await customcommands.findOne({ guild : message.guild.id, user : message.author.id }).then(async(data) => {
                if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You currently do not have a **Now Playing** command set`).setColor(colors.warn)] })
                await customcommands.findOneAndRemove({ guild : message.guild.id, user : message.author.id }).then(() => {
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed your custom **Now Playing** command`).setColor(colors.approve)] })
                })
            })
        } else {
            if (args[2] && args[2] === '--public' && !message.member.permissions.has('MANAGE_GUILD')) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\` to use the **public flag**`).setColor(colors.warn)] })
            if (args[1].length <= 2) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your **command** must be longer than **2 characters**!`).setColor(colors.warn)] })
            await customcommands.findOne({ guild : message.guild.id, user : message.author.id }).then(async(data) => {
                if (!data) {
                    new customcommands({ guild : message.guild.id, user : message.author.id, command : args[1], public : args[2] === '--public' ? true : false, disabled : false }).save().then(() => {
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set your custom **Now Playing** command to: \`${args[1]}\`\n${args[2] === '--public' ? `**Public** flag is enabled - command only usable by **everyone**` : `**Public** flag is disabled - command only usable by ${message.author}`}`).setColor(colors.approve)] })
                    })
                } else {
                    await customcommands.findOneAndUpdate({ guild : message.guild.id, user : message.author.id, command : data.command }, { guild : message.guild.id, user : message.author.id, command : args[1], public : args[2] === '--public' ? true : false, disabled : data.disabled == true ? true : false }).then(() => {
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Updated your custom **Now Playing** command to: \`${args[1]}\`\n${args[2] === '--public' ? `**Public** flag is enabled - command only usable by **everyone**` : `**Public** flag is disabled - command only usable by ${message.author}`}`).setColor(colors.approve)] })
                    })
                }
            })
        }
    }
};

module.exports = customcommand;