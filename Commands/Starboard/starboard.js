const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const pagination = require('../../Functions/pagination')

const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')
const emojis = require('../../Data/emojis.json')

const starboards = require('../../Models/Starboard/starboards')

const commands = ['lock','disable','off','config','configuration','selfstar','timestamp','unlock','enable','on','reset','delete','del','emoji','role','set','threshold','jumpurl','color','attachments','channel']

module.exports = {
    name : 'starboard',
    description : 'Starboard is like pinned messages, but more efficient, significant, customizable and no pin limitation',
    aliases : ['star'],
    permissions : ['MANAGE_GUILD'],
    information : `${emojis.warn} Manage Guild`,
    usage : 'Syntax: starboard (subcommand) <args>\nExample: starboard emoji 🌟',
    module : 'starboard',
    commands : [
        {
            name : 'star'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Starboard
     */


    run : async (client, message, args, prefix) => {
        if (args[0] && args[0] === 'unlock') {
            await starboards.findOne({ guild : message.guild.id }).then(async(data)=>{
                if (!data) {
                    new starboards({ guild : message.guild.id, locked : false, selfstar : false, timestamp : true, emoji : '⭐', threshold : 3, jumpurl : true, color : 'author', attachments : true }).save()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Enabled **starboard**. Use \`${prefix}starboard lock\` to disable.`).setColor(colors.approve)] })
                } else {
                    if (!data.locked) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Starboard** isn't locked. Use \`${prefix}starboard lock\` to disable the module.`).setColor(colors.warn)] })
                    await starboards.findOneAndUpdate({ guild : message.guild.id, locked : true }, { guild : message.guild.id, locked : false })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Enabled **starboard**. Use \`${prefix}starboard lock\` to disable.`).setColor(colors.approve)] })
                }
            })
        } else if (args[0] && args[0] === 'lock') {
            await starboards.findOne({ guild : message.guild.id }).then(async(data)=>{
                if (!data) {
                    return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Starboard** is already locked. Use \`${prefix}starboard unlock\` to enable the module.`).setColor(colors.warn)] })
                } else {
                    if (data.locked) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Starboard** is already locked. Use \`${prefix}starboard unlock\` to enable the module.`).setColor(colors.warn)] })
                    await starboards.findOneAndUpdate({ guild : message.guild.id, locked : false }, { guild : message.guild.id, locked : true })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Disabled **starboard**. Use \`${prefix}starboard unlock\` to enable.`).setColor(colors.approve)] })
                }
            })
        } else if (args[0] && args[0] === 'set') {
            const channel = args[1] ? message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((channel)=>channel.name.includes(args[1])) : message.channel
            if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)] })
            await starboards.findOne({ guild : message.guild.id }).then(async(data)=>{
                if (!data) {
                    new starboards({ guild : message.guild.id, locked : true, selfstar : false, timestamp : true, emoji : '⭐', channel : channel.id, threshold : 3, jumpurl : true, color : 'author', attachments : true }).save()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **channel** has been set to ${channel}`).setColor(colors.approve)] })
                } else {
                    if (data.channel) {
                        await starboards.findOneAndUpdate({ guild : message.guild.id, channel : data.channel }, { guild : message.guild.id, channel : channel.id })
                    } else {
                        await starboards.findOneAndUpdate({ guild : message.guild.id }, { guild : message.guild.id, channel : channel.id })
                    }
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **channel** has been set to ${channel}`).setColor(colors.approve)] })
                }
            })
        } else if (args[0] && args[0] === 'reset') {
            const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Are you sure that you want to **reset** your Starboard configuration?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
            const filter = async (i) => { 
            await i.deferUpdate();
            if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
            return i.user.id == message.author.id;
        };
        const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === 'approve') {
                await starboards.findOneAndDelete({ guild : message.guild.id })
                new starboards({ guild : message.guild.id, locked : true, selfstar : false, timestamp : true, emoji : '⭐', threshold : 3, jumpurl : true, color : 'author', attachments : true }).save()
                msg.delete()
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard has been **reset**. Run ${prefix}help starboard to see list of options.`).setColor(colors.approve)] })
                collector.stop()
            } else if (interaction.customId === 'decline') {
                message.delete()
                msg.delete()
                collector.stop()
            }
        })
        } else if (args[0] && args[0] === 'emoji') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: starboard emoji').setDescription(`Sets the emoji that triggers the starboard messages\`\`\`Syntax: starboard emoji <emoji or emote>\nExample: starboard emoji 🤩\`\`\``).setColor('#718090')] })
            try {
                await message.react(args[1]).then(async()=>{
                    await starboards.findOne({ guild : message.guild.id }).then(async(data)=>{
                        if (!data) {
                            new starboards({ guild : message.guild.id, locked : true, selfstar : false, timestamp : true, emoji : args[0], threshold : 3, jumpurl : true, color : 'author', attachments : true }).save()
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **reaction emoji** has been set to ${args[1]}`).setColor(colors.approve)] })
                        } else {
                            if (data.emoji) {
                                await starboards.findOneAndUpdate({ guild : message.guild.id, emoji : data.emoji }, { guild : message.guild.id, emoji : args[1] })
                            } else {
                                await starboards.findOneAndUpdate({ guild : message.guild.id }, { guild : message.guild.id, emoji : args[1] })
                            }
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **reaction emoji** has been set to ${args[1]}`).setColor(colors.approve)] })
                        }
                    })
                })
            } catch (e) {
                return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Invalid emoji** or I have **no access** to that emote`).setColor(colors.warn)] })
            }
        } else if (args[0] && args[0] === 'config' || args[0] === 'configuration') {
            await starboards.findOne({ guild : message.guild.id }).then(async(data)=>{
                if (!data) {

                } else {
                    const config = new MessageEmbed()
                    .setColor('#7189da')
                    .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
                    .setTitle('Starboard configuration')
                    .setDescription(`**Locked:** ${data.locked ? emojis.approve : emojis.deny}`)
                    .addField(`**General**`, `**Channel:** ${data.channel ? `<#${data.channel}>` : 'No channel set'}\n**Color:** ${data.color === 'author' ? 'Author color' : data.color}\n**Threshold:** ${data.threshold}\n**Emoji:** ${data.emoji}`, true)
                    .addField(`**Options**`, `**Show Attachments**: ${data.attachments == true ? emojis.approve : emojis.deny}\n**Show Timestamp**: ${data.timestamp == true ? emojis.approve : emojis.deny}\n**Show Jump URL**: ${data.jumpurl == true ? emojis.approve : emojis.deny}\n**Self Star**: ${data.selfstar == true ? emojis.approve : emojis.deny}`, true)
                    .addField(`**Count**`, `**Blacklisted Channels:** 0\n**Whitelisted Roles:** 0`, true)
                    message.channel.send({ embeds : [config] })
                }
            })
        } else if (args[0] && args[0] === 'threshold') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: starboard threshold').setDescription(`Sets the default amount stars needed to post\`\`\`Syntax: starboard threshold <amount>\nExample: starboard threshold 3\`\`\``).setColor('#718090')] })
            if (isNaN(args[1])) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Converting to "int" failed for parameter "threshold".`).setColor(colors.warn)] })
            if (args[1] < 1) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Threshold must be greater than **0**!`).setColor(colors.warn)] })
            await starboards.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data) {
                    new starboards({ guild : message.guild.id, locked : true, selfstar : false, timestamp : true, emoji : '⭐', threshold : Number(args[1]), jumpurl : true, color : 'author', attachments : true }).save()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **threshold** has been set to \`${args[1]}\``).setColor(colors.approve)] })
                } else {
                    await starboards.findOneAndUpdate({ guild : message.guild.id, threshold : data.threshold }, { guild : message.guild.id, threshold : Number(args[1]) })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Starboard **threshold** has been set to \`${args[1]}\``).setColor(colors.approve)] })
                }
            })
        } else if (args[0] && args[0] === 'channel') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: starboard channel').setDescription(`Ignore a channel so messages dont get starred\`\`\`Syntax: starboard channel <channel>\nExample: starboard channel #commands\`\`\``).setColor('#718090')] })
            if (args[1] === 'list') {
                const sb = await starboards.findOne({ guild: message.guild.id });
                if (!sb || sb.ignoredChannels.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author} No **blacklisted channels** for Starboard were found`).setColor('#7189da')] })
                const starboardPages = [];
                let starboardIndex = 0;
                const starboardPager = sb.ignoredChannels.pager(10);
                starboardPager.forEach((page) => {
                    const items = page.map((starboard) => { return `\`${++starboardIndex}\` <#${starboard.channel}>`; }).join('\n');
                    starboardPages.push(new MessageEmbed().setAuthor({ name : message.member.displayName, iconURL : message.author.displayAvatarURL({ dynamic: true }) }).setTitle('Starboard channel blacklist').setColor(message.member.displayHexColor).setDescription(items).setFooter({ text : `Page 1/1 (${starboardPages === 1 ? 'entry' : 'entries'})` }))
                });
                if (starboardPages.length > 1) { await pagination(message, starboardPages, starboardPager.length, starboardIndex, ` (${starboardIndex} ${starboardIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [starboardPages[0]] }); }
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((channel)=>channel.name.includes(args[1]))
                if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)] })
                
            }

        }
    },
};