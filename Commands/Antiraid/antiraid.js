const newaccounts = require('../../Models/Antiraid/newaccounts')
const whitelists = require('../../Models/Antiraid/whitelists')
const pagination = require('../../Functions/pagination')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'antiraid',
    description : 'Configure protection against potential raids',
    permissions : ['MANAGE_GUILD'],
    information : `${emojis.warn} Manage Guild`,
    usage : { syntax : '(subcommand) <args>' },
    module : 'antiraid',
    commands : [
        {
            name : 'antiraid newaccounts',
            description : 'Punish new registered accounts',
            aliases : ['newaccount'],
            parameters : 'setting, flags',
            information : `${emojis.warn} Manage Guild`,
            usage : { syntax : '(on or off) (parameters)', example : 'on --do ban --threshold 1' }
        },
        {
            name : 'antiraid defaultpfp',
            description : 'Punish accounts without a profile picture',
            parameters : 'setting, flags',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: antiraid defaultpfp (on or off) (parameters)\nExample: antiraid defaultpfp on --do kick'
        },
        {
            name : 'antiraid whitelist',
            description : 'Create a **one-time** whitelist to allow a user to join',
            parameters : 'member',
            information : `${emojis.warn} Manage Guild`,
            usage : `Syntax: antiraid whitelist <user id>\nExample: antiraid whitelist ${config.ownerid}`,
            commands : [
                {
                    name : 'antiraid whitelist view',
                    description : 'View all current antinuke whitelists',
                    aliases : ['list'],
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: antiraid whitelist view'
                }
            ]
        },
        {
            name : 'antiraid massjoin',
            description : 'Protect server against mass bot raids',
            parameters : 'setting, flags',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: antiraid massjoin (on or off) (parameters)\nExample: antiraid massjoin on --do kick'
        },
        {
            name : 'antiraid config',
            description : 'View server antiraid configuration',
            aliases : ['configuration'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: antiraid config'
        },
        {
            name : 'antiraid raidstate',
            description : 'Turn off server\'s raid state',
            aliases : ['removeraid'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: antiraid raidstate'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Antiraid
     */

    run : async (client, message, args, prefix) => {
        const commands = ['newaccounts', 'newaccount', 'defaultpfp', 'whitelist', 'massjoin', 'config', 'configuration', 'raidstate', 'removeraid']
        if (!args[0] || !commands.includes(args[0])) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name : `${client.user.username}`, iconURL : client.user.avatarURL() }).setTitle('Command: antiraid').setDescription(`Configure protection against potential raids\`\`\`Syntax: ${prefix}antiraid (subcommand) <args>\nExample: ${prefix}antiraid massjoin on --do kick\`\`\``).setColor(colors.help)] })
        if (args[0] === 'newaccounts' || args[0] === 'newaccount') {
            if (!args[1] || !['on', 'off'].includes(args[1])) {

                const i = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`:grey_question: Do you want to **enable** or **disable** punishment against new accounts? **Yes** or **no**?`).setColor(colors.raven)] })
                const filter = m => m.author.id === message.author.id; const collector = message.channel.createMessageCollector({ filter, time: 12000, max: 1 });
                collector.on('collect', async (x) => {
                    if (!['yes', 'no'].includes(x.content.toLowerCase())) {
                        i.delete(); return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Incorrect usage** of command. Check syntax and try again`).setColor(colors.warn)] })
                    } else if (x.content.toLowerCase() === 'yes') {
                        await newaccounts.findOne({ guild : message.guild.id }).then(async (data) => {
                            i.delete(); if (data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Newaccounts** antiraid has been **enabled** already`).setColor(colors.warn)] })
                            new newaccounts({ guild : message.guild.id, punishment : 'ban', threshold : 7 }).save(); return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Updated **newaccounts** antiraid. Punishment set to **ban** , threshold set to **7**`).setColor(colors.approve)] })
                        })
                    } else if (x.content.toLowerCase() === 'no') {
                        await newaccounts.findOne({ guild : message.guild.id }).then(async (data) => {
                            i.delete(); if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Newaccounts** antiraid has been **disabled** already`).setColor(colors.warn)] })
                            await newaccounts.findOneAndRemove({ guild : message.guild.id }); return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Disabled **newaccounts** antiraid module`).setColor(colors.approve)] })
                        })
                    }
                })
                collector.on('end', async (collected) => {
                    if (collected.size === 0) {
                        i.delete(); return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Incorrect usage** of command. Check syntax and try again`).setColor(colors.warn)] })
                    }
                })

            } else if (args[1] === 'on') {
                await newaccounts.findOne({ guild : message.guild.id }).then(async (data) => {
                    if (data) {
                        let punishment = ''; let threshold = ''
                        for (const str of args.slice(1).join(' ').split('--').values()) {
                            if (str.startsWith('do')) punishment = str.toString().replace('do', '').trim()
                            if (str.startsWith('threshold')) threshold = parseInt(str.toString().replace('threshold', '').trim())
                        }
                        if (args.slice(1).join(' ').includes('--do') && punishment.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Argument --do: expected one argument`).setColor(colors.warn)] })
                        if (args.slice(1).join(' ').includes('--threshold') && threshold.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Argument --threshold: expected one argument`).setColor(colors.warn)] })
                        if (!['ban', 'kick'].includes(punishment.toLowerCase()) && punishment.length !== 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid punishment passed. Choose from either **ban, kick**`).setColor(colors.warn)] });
                        if (isNaN(threshold)) return; if (data.punishment === punishment.toLowerCase() || data.threshold === threshold || punishment.length === 0 || threshold.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Newaccounts** antiraid has been **enabled** already`).setColor(colors.warn)] })
                        await newaccounts.findOneAndUpdate({ guild : message.guild.id, punishment : data.punishment, threshold : data.threshold }, { guild : message.guild.id, punishment : punishment.length === 0 ? 'ban' : punishment, threshold : threshold.length === 0 ? 7 : threshold })
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Updated **newaccounts** antiraid. Punishment set to **${punishment.length === 0 ? 'ban' : punishment}** , threshold set to **${threshold.length === 0 ? '7' : String(threshold)}**`).setColor(colors.approve)] })
                    } else {
                        let punishment = ''; let threshold = ''
                        for (const str of args.slice(1).join(' ').split('--').values()) {
                            if (str.startsWith('do')) punishment = str.toString().replace('do', '').trim()
                            if (str.startsWith('threshold')) threshold = parseInt(str.toString().replace('threshold', '').trim())
                        }
                        if (args.slice(1).join(' ').includes('--do') && punishment.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Argument --do: expected one argument`).setColor(colors.warn)] })
                        if (args.slice(1).join(' ').includes('--threshold') && threshold.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Argument --threshold: expected one argument`).setColor(colors.warn)] })
                        if (!['ban', 'kick'].includes(punishment.toLowerCase()) && punishment.length !== 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid punishment passed. Choose from either **ban, kick**`).setColor(colors.warn)] });
                        if (isNaN(threshold)) return; await new newaccounts({ guild : message.guild.id, punishment : data.punishment, threshold : data.threshold }, { guild : message.guild.id, punishment : punishment.length === 0 ? 'ban' : punishment, threshold : threshold.length === 0 ? 7 : threshold }).save()
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Enabled **newaccounts** antiraid. Punishment set to **${punishment.length === 0 ? 'ban' : punishment}** , threshold set to **${threshold.length === 0 ? '7' : String(threshold)}**`).setColor(colors.approve)] })
                    }
                })
            } else if (args[1] === 'off') {
                await newaccounts.findOne({ guild : message.guild.id }).then(async (data) => {
                    if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **Newaccounts** antiraid has been **disabled** already`).setColor(colors.warn)] })
                    await newaccounts.findOneAndRemove({ guild : message.guild.id }); return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Disabled **newaccounts** antiraid module`).setColor(colors.approve)] })
                })
            }
        } else if (args[0] === 'defaultpfp') {

        } else if (args[0] === 'whitelist') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name : `${client.user.username}`, iconURL : client.user.avatarURL() }).setTitle('Command: antiraid whitelist').setDescription(`Create a **one-time** whitelist to allow a user to join\`\`\`Syntax: ${prefix}antiraid whitelist <user id>\nExample: ${prefix}antiraid whitelist ${config.ownerid}\`\`\``).setColor(colors.help)] })
            if (args[1] === 'view' || args[1] === 'list') {
                await whitelists.findOne({ guild : message.guild.id }).then(async(data) => {
                    if (!data || data.whitelistedUsers.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author}: No **users** are currently whitelisted`).setColor(colors.raven)] })
                    const embeds = [];
                    let whitelistIndex = 0;
                    const whitelistedUsers = data.whitelistedUsers.pager(10);
                    whitelistedUsers.forEach((page) => {
                        const list = page.map((item) => { return `\`${++whitelistIndex}\` **${client.users.cache.get(item.user) ? client.users.cache.get(item.user).tag : 'Unknown'}** (\`${item.user}\`)`}).join("\n");
                        embeds.push(new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) }).setTitle("Antiraid Whitelists").setColor(message.member.displayHexColor).setDescription(list).setFooter({ text : `Page 1/1 (${whitelistIndex} ${whitelistIndex === 1 ? 'entry' : 'entries'})` }));
                    });
                    if (embeds.length > 1) { await pagination(message, embeds, whitelistedUsers.length, whitelistIndex, ` (${whitelistIndex} ${whitelistIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [embeds[0]] });}
                })
            } else {
                const user = await client.users.fetch(client.users.resolveId(await message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(member => member.user.username.toLowerCase().includes(args[1].toLowerCase()) || member.displayName.toLowerCase().includes(args[1].toLowerCase())) || args[1])).catch(() => null);
                if (!user) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find that **member** or the **ID** is invalid`).setColor(colors.warn)] })
                if (user.id === client.user.id) return message.channel.send('-_-')
                if (message.guild.members.cache.get(user.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **${user.tag}** is already in this **server**`).setColor(colors.warn)] })
                await whitelists.findOne({ guild : message.guild.id }).then(async (data) => {
                    if (data) {
                        const check = []
                        await data.whitelistedUsers.map(async(item) => { check.push(item.user) })
                        if (check.includes(user.id)) {
                            data.whitelistedUsers = data.whitelistedUsers.filter(item => item.user !== user.id) 
                            await whitelists.findOneAndUpdate({ guild: message.guild.id }, data); 
                            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${user.tag}** is no longer **temporarily** whitelisted`).setColor(colors.approve)] })
                        } else {
                            data.whitelistedUsers.push({ user : user.id });
                            await whitelists.findOneAndUpdate({ guild: message.guild.id }, data); 
                            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${user.tag}** is now **temporarily** whitelisted and can join`).setColor(colors.approve)] })
                        }
                    } else {
                        new whitelists({ guild : message.guild.id, whitelistedUsers : [{ user : user.id }] }).save()
                        return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${user.tag}** is now **temporarily** whitelisted and can join`).setColor(colors.approve)] })   
                    }
                })
            }
        } else if (args[0] === 'massjoin') {

        } else if (args[0] === 'config' || args[0] === 'configuration') {
            let newaccount = `**Punish New Accounts:** ${emojis.deny} (do: N/A, threshold: N/A)`; const newaccounts2 = await newaccounts.findOne({ guild : message.guild.id }); if (newaccounts) newaccount = `**Punish New Accounts:** ${emojis.approve} (do: ${newaccounts2.punishment}, threshold: ${String(newaccounts2.threshold)})`
            const configuration = new MessageEmbed()
            .setColor(colors.raven)
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.member.displayAvatarURL({ dynamic : true }) })
            .setTitle(`Antiraid settings`)
            .setDescription(`**Current Raid State:** Safe`)
            .addField(`**Modules**`, `${newaccount}`)
            message.channel.send({ embeds : [configuration] })
        }
    },
};

