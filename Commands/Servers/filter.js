const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const filterNicknames = require('../../Models/Servers/filterNicknames')
const { pagination } = require('../../Functions/newpag')
const filters = require('../../Models/Servers/filter')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
module.exports = {
    name : 'filter',
    description : 'View a variety of options to help clean chat',
    permissions : ['MANAGE_CHANNELS'],
    information : `${emojis.warn} Manage Channels`,
    usage : 'Syntax: filter (subcommand) <args>\nExample: filter add Poop',
    module : 'servers',
    pages : [
        {
            name : 'filter spam',
            description : 'Delete messages from users that send messages too fast',
            aliases : ['antispam'],
            parameters : 'channel, setting, parameters',
            information : `${emojis.warn} Manage Channels`,
            usage : 'Syntax: filter spam (channel or \'all\') <on or off> --params\nExample: filter spam #general on',
            commands : [
                {
                    name : 'filter spam exempt',
                    description : 'Exempt roles from the antispam filter',
                    aliases : ['antispam'],
                    parameters : 'role',
                    information : `${emojis.warn} Manage Channels`,
                    usage : 'Syntax: filter spam exempt @role\nExample: filter spam exempt @Level 5',
                    commands : [
                        {
                            name : 'filter spam exempt list',
                            description : 'View list of roles exempted from spam filter',
                            information : `${emojis.warn} Manage Channels`,
                            usage : 'Syntax: filter spam exempt list\nExample: filter spam exempt list'
                        }
                    ]
                }
            ]
        },
        {
            name : 'filter list',
            description : 'View a list of filtered words in guild',
            information : `${emojis.warn} Manage Channels`,
            usage : 'Syntax: filter list'
        },
        {
            name : 'filter nicknames',
            description : 'Automatically reset nicknames if a filtered word is detected',
            aliases : ['nicks', 'nick', 'nickname'],
            parameters : 'setting',
            information : `${emojis.warn} Manage Channels`,
            usage : 'Syntax: filter nicknames (on or off)\nExample: filter nicknames on',
        },
        {
            name : 'filter massmention'
        },
        {
            name : 'filter reset'
        },
        {
            name : 'filter links'
        },
        {
            name : 'filter musicfiles'
        },
        {
            name : 'filter spoilers'
        },
        {
            name : 'filter add'
        },
        {
            name : 'filter selfbot'
        },
        {
            name : 'filter invites'
        },
        {
            name : 'filter exempt'
        },
        {
            name : 'filter whitelist'
        },
        {
            name : 'filter caps'
        },
        {
            name : 'filter update'
        },
        {
            name : 'filter remove'
        },
        {
            name : 'filter snipe'
        },
        {
            name : 'filter emoji'
        }
    ],
    async run (client, message, args) {
        if (!args[0]) return
        if (args[0] === 'nicknames' || args[0] === 'nicks' || args[0] === 'nick' || args[0] === 'nickname') {
            if (!args[1]) return;
            const settings = ['on', 'off', 'exempt']; if (!settings.includes(args[1])) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Incorrect usage** of command. Check syntax and try again.`).setColor(colors.warn)] })
            if (args[1] === 'exempt') {
                if (!args[2]) return;
                if (args[2] === 'list') {
                    await filterNicknames.findOne({ guild : message.guild.id }).then(async(guild) => {
                        if (!guild || guild.ignoredRoles.length === 0) return message.channel.send({ embeds : [new MessageEmbed({ description : `:mag_right: ${message.author}: No exempted roles for **nicknames** filter was found`, color : colors.raven })] })
                        
                        const embeds = [];
                        let filterIndex = 0;
                
                        const ignoredRoles = guild.ignoredRoles.pager(10);
                    
                        ignoredRoles.forEach((page) => {
                          const list = page.map((item) => { return `\`${++filterIndex}\` ${message.guild.roles.cache.get(item.role)} (\`${item.role}\`)`}).join("\n");
                    
                          const embed = new MessageEmbed()
                            .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTitle("Exempted roles for nicknames")
                            .setColor(message.member.displayHexColor)
                            .setDescription(list)
                            .setFooter({ text : `Page 1/1 (${filterIndex} ${filterIndex === 1 ? 'entry' : 'entries'})` })
                          embeds.push(embed);
                        });
                    
                        if (embeds.length > 1) {
                            return await new pagination(message, embeds, embeds.length, filterIndex).send()
                        } else {
                          return message.channel.send({ embeds: [embeds[0]] });
                        }
                    })
                } else {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name.includes(args.slice(2).join(' ')))
                    if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args.slice(2).join(' ')}**`).setColor(colors.warn)] })
                    await filterNicknames.findOne({ guild : message.guild.id }).then(async(data) => {
                        if (!data) {
                            new filterNicknames({ guild : message.guild.id, enabled : false, ignoredRoles : [{ role : role.id }] }).save()
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Ignoring **nicknames** from members with ${role}`).setColor(colors.approve)] })
                        } else {
                            const array = []
                            if (data.ignoredRoles) {
                                await data.ignoredRoles.map((item) => { array.push(item.role) })
                                if (array.includes(role.id)) {
                                    data.ignoredRoles = data.ignoredRoles.filter(item => item.role !== role.id) 
                                    await filterNicknames.findOneAndUpdate({ guild: message.guild.id }, data);
                                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: No longer ignoring **nicknames** from members with ${role}`).setColor(colors.approve)] })
                                } else {
                                    data.ignoredRoles.push({ role : role.id });
                                    await filterNicknames.findOneAndUpdate({ guild: message.guild.id }, data);
                                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Ignoring **nicknames** from members with ${role}`).setColor(colors.approve)] })
                                }
                            } else {
                                await filterNicknames.findOneAndUpdate({ guild : message.guild.id, enabled : data.enabled }, { guild : message.guild.id, enabled : data.enabled, ignoredRoles : [{ role : role.id }] })
                                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Ignoring **nicknames** from members with ${role}`).setColor(colors.approve)] })
                            }
                        }
                    })
                }
            } else {
                await filterNicknames.findOne({ guild : message.guild.id }).then(async(data) => {
                    if (args[1] === 'on') {
                        if (!data) {
                            new filterNicknames({ guild : message.guild.id, enabled : true }).save()
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Enabled **nickname filtering**`).setColor(colors.approve)] })
                        } else {
                            if (data.enabled === true) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Nickname filtering is **already enabled**`).setColor(colors.warn)] })
                            await filterNicknames.findOneAndUpdate({ guild : message.guild.id, enabled : data.enabled }, { guild : message.guild.id, enabled : true })
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Enabled **nickname filtering**`).setColor(colors.approve)] })
                        }
                    } else if (args[1] === 'off') {
                        if (!data) {
                            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Nickname filtering is **already disabled**`).setColor(colors.warn)] })
                        } else {
                            if (data.enabled === false) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Nickname filtering is **already disabled**`).setColor(colors.warn)] })
                            await filterNicknames.findOneAndUpdate({ guild : message.guild.id, enabled : data.enabled }, { guild : message.guild.id, enabled : false })
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Disabled **nickname filtering**`).setColor(colors.approve)] })
                        }
                    }
                })
            }
        } else if (args[0] === 'massmention') {

        } else if (args[0] === 'reset' || args[0] === 'clear') {
            const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Are you sure that you would like to remove every **filtered word**?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
        const filter = async (i) => { 
            await i.deferUpdate();
            if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
            return i.user.id == message.author.id;
        };
        const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === 'approve') {
                await filters.findOneAndDelete({ guild : message.guild.id })
                msg.delete()
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed every **filtered word** for this guild`).setColor(colors.approve)] })
                collector.stop()
            } else if (interaction.customId === 'decline') {
                message.delete()
                msg.delete()
                collector.stop()
            }
        })
        }
        if (args[0] && args[0] === 'add') {
            const word = args.slice(1).join(' ')
            const check = await filters.findOne({ guild : message.guild.id })
            if (!check) {
                let item = {};
                item.guild = message.guild.id, item.filteredWords = [{ word : word },];
                new filters(item).save();
            } else {
                const array = []
                await check.filteredWords.map(async(item) => {
                    array.push(item.word)
                })
                if (array.includes(word)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: \`${word}\` is already filtered`).setColor(colors.warn)] })
                check.filteredWords.push({ word : word });
                await filters.findOneAndUpdate({ guild: message.guild.id }, check);
            }
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Filtered word \`${word}\`. Punishment is set to **delete**`).setColor(colors.approve)] })
        } else if (args[0] && args[0] === 'remove') {
            
            const word = args.slice(1).join(' ')
            const check = await filters.findOne({ guild : message.guild.id })
            if (!check) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: \`${word}\` is not a filtered word`).setColor(colors.warn)] })
            const array = []
                await check.filteredWords.map(async(item) => {
                    array.push(item.word)
                })
                if (!array.includes(word)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: \`${word}\` is not a filtered word`).setColor(colors.warn)] })
            check.filteredWords = check.filteredWords.filter(item => item.word !== word) 
            await filters.findOneAndUpdate({ guild: message.guild.id }, check);
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Deleted filtered word \`${word}\``).setColor(colors.approve)] })
        
        } else if (args[0] && args[0] === 'list') {
            await filters.findOne({ guild : message.guild.id }).then(async(guild) => {
                if (!guild || guild.filteredWords.length === 0) return message.channel.send({ embeds : [new MessageEmbed({ description : `:mag_right: ${message.author}: No **filtered words** were found`, color : colors.raven })] })
                
                const embeds = [];
                let filterIndex = 0;
            
                const filteredWords = guild.filteredWords.pager(10);
            
                filteredWords.forEach((page) => {
                  const list = page.map((item) => { return `\`${++filterIndex}\` ${item.word}`}).join("\n");
            
                  const embed = new MessageEmbed()
                    .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle("Filtered words")
                    .setColor(message.member.displayHexColor)
                    .setDescription(list)
                  embeds.push(embed);
                });
            
                if (embeds.length > 1) {
                  await pagination(message, embeds, filteredWords.length, filterIndex);
                } else {
                  return message.channel.send({ embeds: [embeds[0]] });
                }
            })
        }
    }
}