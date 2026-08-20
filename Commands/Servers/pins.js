const emojis = require('../../Data/emojis.json'), colors = require('../../Data/colors.json')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const pins = require('../../Models/Servers/pins')
module.exports = {
    name : 'pins',
    description : 'Pin archival system commands',
    permissions : ['MANAGE_GUILD'],
    information : `${emojis.warn} Manage Guild`,
    usage : 'Syntax: pins (subcommand) <args>',
    module : 'servers',
    pages : [
        {
            name : 'pins unpin',
            description : 'Enable or disable the unpinning of meassages during archival',
            parameters : 'option',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: pins unpin (on or off)'
        },
        {
            name : 'pins archive',
            description : 'Archive the pins in the current channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: pins archive'
        },
        {
            name : 'pins channel',
            description : 'Set the pin archival channel',
            parameters : 'channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: pins channel (channel)'
        },
        {
            name : 'pins config',
            description : 'View the pin archival config',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: pins config'
        },
        {
            name : 'pins automatic',
            description : 'Enable or automatic pin archival events',
            parameters : 'event, setting',
            information : `${emojis.warn} Manage Guild`,
            usage : `Syntax: pins automatic ('full', 'delete' or 'all') (on or off)\nExample: pins automatic full on`
        },
        {
            name : 'pins set',
            description : 'Enable or disable the pin archival system',
            parameters : 'option',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: pins set (on or off)'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Pins
     */

    run : async (client, message, args, prefix) => {
        const commands = ['unpin','archive','channel','config','automatic','set', 'reset']
        if (!args[0] || !commands.includes(args[0])) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: pins').setDescription(`Pin archival system commands\`\`\`Syntax: ${prefix}pins (subcommand) <args>\`\`\``).setColor('#718090')] })
        
        if (args[0] === 'unpin') {

            const options = ['on', 'enable', 'off', 'disable']

            if (!args[1] || !options.includes(args[1])) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid or no option. Valid options: \`on\`, \`enable\`, \`off\` or \`disable\``).setColor(colors.warn)] })

            await pins.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **pin archival** config was found, you can create one with the \`${prefix}pins channel\` command`).setColor(colors.warn)] })
                if (args[1] === 'on' || args[1] === 'enable') {
                    await pins.findOneAndUpdate({ guild : message.guild.id, unpin : data.unpin }, { guild : message.guild.id, unpin : true })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Pin archival unpinning **enabled**`).setColor(colors.approve)] })
                } else if (args[1] === 'off' || args[1] === 'disable') {
                    await pins.findOneAndUpdate({ guild : message.guild.id, unpin : data.unpin }, { guild : message.guild.id, unpin : false })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Pin archival unpinning **disabled**`).setColor(colors.approve)] })
                }
            })

        } else if (args[0] === 'archive') {
            await pins.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **pin archival** config was found, you can create one with the \`${prefix}pins channel\` command`).setColor(colors.warn)] })
                if (!data.enabled) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Pin archival** is disabled`).setColor(colors.warn)] })
                let archived = []
                message.channel.messages.fetchPinned().then(async(pins) => {
                    let i = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${message.author}: Starting **archival process**.. this may take a while`).setColor(`#7189c6`)] })
                    pins.forEach((msg) => {
                        data.unpin ? msg.unpin() : null
                        archived.push(msg)
                        message.guild.channels.cache.get(data.channel).send({ embeds : [new MessageEmbed().setAuthor({ name : `${msg.author.username}`, iconURL : msg.author.displayAvatarURL({ dynamic : true }) }).setDescription(`${msg.content}`).setImage(msg.attachments.first() ? msg.attachments.first().proxyURL : null).setFooter({ text : `Pinned in #${msg.channel.name}` }).setTimestamp()] })
                    })
                    function wait(ms) { let start = new Date().getTime(); let end = start; while (end < start + ms) {end = new Date().getTime();} } wait(3500)
                    i.edit({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Archived **${archived.length}** ${archived.length === 1 ? 'pin' : 'pins'}`).setColor(colors.approve)] })
                })
            })
        } else if (args[0] === 'channel') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: pins channel').setDescription(`Set the pin archival channel\`\`\`Syntax: ${prefix}pins channel (channel)\`\`\``).setColor('#718090')] })
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((c) => { c.name.includes(args[1]) })
            if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)] })
            await pins.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data) {
                    new pins({ guild : message.guild.id, enabled : true, unpin : true, channel : channel.id }).save()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **Pin archival** channel set to ${channel}`).setColor(colors.approve)] })
                } else {
                    await pins.findOneAndUpdate({ guild : message.guild.id, channel : data.channel }, { guild : message.guild.id, channel : channel.id })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **Pin archival** channel set to ${channel}`).setColor(colors.approve)] })
                }
            })
        } else if (args[0] === 'config') {
            await pins.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **pin archival** config was found, you can create one with the \`${prefix}pins channel\` command`).setColor(colors.warn)] })
                const config = new MessageEmbed()
                .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
                .setTitle(`Pin Archival Config`)
                .setDescription(`**Enabled:** ${data.enabled ? emojis.approve : emojis.deny}\n**Unpin:** ${data.unpin ? emojis.approve : emojis.deny}\n**Channel:** <#${data.channel}>`)
                .setColor(`#7189da`)
                message.channel.send({ embeds : [config] })
            })
        } else if (args[0] === 'automatic') {
            return;
        } else if (args[0] === 'set') {

        } else if (args[0] === 'reset') {
            const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Are you sure you want to clear the **pin archive** config?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
            const filter = async (i) => { 
                await i.deferUpdate();
                if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
                return i.user.id == message.author.id;
            };
            const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
            collector.on("collect", async (interaction) => {
                if (interaction.customId === 'approve') {
                    await pins.findOneAndDelete({ guild : message.guild.id })
                    msg.delete()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **Pin archival** config reset.`).setColor(colors.approve)] })
                    collector.stop()
                } else if (interaction.customId === 'decline') {
                    message.delete()
                    msg.delete()
                    collector.stop()
                }
            })
        }
    },
};