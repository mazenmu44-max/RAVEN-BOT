const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const {
    MessageEmbed
} = require('discord.js')

// Schemas
const baseroleSchema = require('../../Models/Servers/baserole')
const jaillogSchema = require('../../Models/Moderation/jaillog')
const jailSchema = require('../../Models/Moderation/jail')
const autonickSchema = require('../../Models/Servers/autonick')
const welcomeSchema = require('../../Models/Servers/welcome')
const joinlogs = require('../../Models/Servers/joinlogs')
const imgonly = require('../../Models/Servers/imgonly')
const stickymessage = require('../../Models/Servers/stickymessages')
const config = require('../../Data/config.json')
const { Database } = require('quickmongo');
const db = new Database(config.mongoURI, `stickymessagesDatabase`);

module.exports = {
    name: 'settings',
    description: 'Server configuration - visit https://raven.bot/help for all commands',
    aliases: ['bind'],
    permissions: ['MANAGE_GUILD'],
    information: `${emojis.warn} Manage Guild`,
    usage: 'Syntax: settings (subcommand) <args>\nExample: settings jail #jail',
    module: 'servers',
    pages: [
        {
            name : 'settings baserole',
            description : 'Set the base role for where boost roles will go under',
            aliases : ['baseid'],
            parameters : 'role',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings baserole <role>\nExample: settings baserole ------'
        },
        {
            name : 'settings invokejailmessage',
            description : 'Set a custom invoke jail message',
            aliases : ['invokejailmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokejailmessage <message or embed code>\nExample: settings invokejailmessage Something here idk'
        },
        {
            name : 'settings config',
            description : 'View settings configuration for guild',
            aliases : ['list', 'configuration'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings configuration'
        },
        {
            name : 'settings invokeunjailmessage',
            description : 'Set a custom invoke unjail message',
            aliases : ['invokeunjailmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokeunjailmessage <message or embed code>\nExample: settings invokeunjailmessage Something here idk' 
        },
        {
            name : 'settings jailmsg',
            description : 'Set a custom jail message',
            aliases : ['jailmessage'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings jailmsg <text>$example'
        },
        {
            name : 'settings autonick',
            description : 'Set a nickname to be assigned to members when they join',
            parameters : 'nick',
            usage : 'Syntax: settings autonick <text>'
        },
        {
            name : 'settings staff',
            description : 'Set staff role(s)',
            parameters: 'role',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings staff <role>\nExample: settings staff Admin',
            pages : [
                {
                    name : 'settings staff list',
                    description : 'View a list of all staff roles',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings staff list',
                }
            ]
        },
        {
            name : 'settings invokekickmessage',
            description : 'Set a custom invoke kick message',
            aliases : ['invokekickmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokekickmessage <message or embed code>\nExample: settings invokekickmessage Something here idk' 
        },
        {
            name : 'settings imgonly',
            description : 'Set up image + caption only channels',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings imgonly <add or remove> <channel>\nExample: settings imgonly add #submissions',
            pages : [
                {
                    name : 'settings imgonly list',
                    description : 'View all gallery channels',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings imgonly list'
                },
                {
                    name : 'settings imgonly add',
                    description : 'Set a gallery channel',
                    aliases : ['create'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings imgonly add (channel)\nExample: settings imgonly add #icons'
                },
                {
                    name : 'settings imgonly remove',
                    description : 'Remove a gallery channel',
                    aliases : ['delete', 'del'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings imgonly remove (channel)\nExample: settings imgonly remove #icons'
                }
            ]
        },
        {
            name : 'settings resetcases',
            description : 'Reset jail-log cases',
            information : `${emojis.warn} Administrator`,
            usage : 'Syntax: settings resetcases'
        },
        {
            name : 'settings lockignore',
            description : 'Blocks a channel from being altered when using the "unlock all" command',
            usage : 'Syntax: settings lockignore (subcommand) <args>\nExample: settings lockignore add #announcements',
            pages : [
                {
                    name : 'settings lockignore add',
                    description : 'Set an ignored lockdown channel',
                    aliases : ['create'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings lockignore add (channel)\nExample: settings lockignore add #joneral'
                },
                {
                    name : 'settings lockignore list',
                    description : 'View all ignored lockdown channels',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings lockignore list',
                },
                {
                    name : 'settings lockignore remove',
                    description : 'Remove an ignored lockdown channel',
                    aliases : ['delete', 'del'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings lockignore remove (channel)\nExample: settings lockignore remove #joneral'
                }
            ]
        },
        {
            name : 'settings goodbye',
            description : 'Set up a goodbye message in one or multiple channels',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings goodbye (subcommand) <args> --params\nExample: settings goodbye add #goodbye See you soon! {user}',
            pages : [
                {
                    name : 'settings goodbye list',
                    description : 'View all goodbye messages',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings goodbye list',
                },
                {
                    name : 'settings goodbye remove',
                    description : 'Remove a goodbye message from a channel',
                    aliases : ['delete', 'del'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings goodbye remove (channel)\nExample: settings goodbye view #joneral' 
                },
                {
                    name : 'settings goodbye variables',
                    description : 'View all available variables for goodbye messages',
                    aliases : ['vars'],
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings goodbye variables'
                },
                {
                    name : 'settings goodbye add',
                    description : 'Add a goodbye message for a channel',
                    aliases : ['create'],
                    parameters : 'channel, message'
                },
                {
                    name : 'settings goodbye view',
                    description : 'View goodbye message for a channel',
                    aliases : ['check'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings goodbye view (channel)\nExample: settings goodbye view #joneral'
                }
            ]
        },
        {
            name : 'settings invokewarnmessage',
            description : 'Set a custom invoke warn message',
            aliases : ['invokewarnmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokewarnmessage <message or embed code>\nExample: settings invokewarnmessage Something here idk' 
        },
        {
            name : 'settings disablecustomfms',
            description : 'Disable custom Now Playing commands',
            aliases : ['disablefms'],
            parameters : 'arg',
            information : `${emojis.warn} Manage Channels`,
            usage : 'Syntax: settings disablecustomfms (yes or no)\nExample: settings disablecustomfms yes'
        },
        {
            name : 'settings warndm'
        },
        {
            name : 'settings jaildm'
        },
        {
            name : 'settings unjaildm'
        },
        {
            name : 'settings welcome',
            description : 'Set up a welcome message in one or multiple channels',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings welcome (subcommand) <args> --params\nExample: settings welcome add #hi Hi {user.mention}! --self_destruct 10',
            pages : [
                {
                    name : 'settings welcome variables',
                    description : 'View all available variables for welcome messages',
                    aliases : ['vars'],
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings welcome variables'
                },
                {
                    name : 'settings welcome list',
                    description : 'View all welcome messages',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings welcome list'
                },
                {
                    name : 'settings welcome remove',
                    description : 'Remove a welcome message from a channel',
                    aliases : ['delete', 'del'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings welcome remove (channel)\nExample: settings welcome remove #joneral'
                },
                {
                    name : 'settings welcome add',
                    description : 'Add a welcome message for a channel',
                    aliases : ['create'],
                    parameters : 'channel, message',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings welcome add (channel) (message) --params\nExample: settings welcome add #hi Hi {user.mention}! --self_destruct 10'
                },
                {
                    name : 'settings welcome view',
                    description : 'View welcome message for a channel',
                    aliases : ['check'],
                    parameters : 'channel',
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings welcome view (channel)\nExample: settings welcome view #joneral'
                }
            ]
        },
        {
            name : 'settings unbandm'
        },
        {
            name : 'settings ignoreactivity',
            description : 'Post auto messages if the targeted channel is active or not',
            parameters : 'arg',
            information : `${emojis.warn} Manage Channels`,
            usage : 'Syntax: settings ignoreactivity (yes or no)\nExample: settings ignoreactivity yes' 
        },
        {
            name : 'settings googlesafetylevel',
            description : 'Enable or disable safety level for google commands',
            aliases : ['googlesafety', 'safetylevel', 'gs'],
            parameters : 'arg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings googlesafetylevel <yes or no>\nExample: settings googlesafetylevel yes'
        },
        {
            name : 'settings tempbandm'
        },
        {
            name : 'settings softbandm'
        },
        {
            name : 'settings jailroles',
            description : 'Enable or disable removal of roles for jail',
            parameters : 'arg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings jailroles <yes or no>\nExample: settings jailroles yes'
        },
        {
            name : 'settings bandm'
        },
        {
            name : 'settings jaillog',
            description : 'Set jail-log for moderation module in guild',
            aliases : ['modlog'],
            parameters : 'channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings jaillog <channel>\nExample: settings jaillog #mod-log'
        },
        {
            name : 'settings invokebanmessage',
            description : 'Set a custom invoke ban message',
            aliases : ['invokebanmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokebanmessage <message or embed code>\nExample: settings invokebanmessage Something here idk' 
        },
        {
            name : 'settings joinlogs',
            description : 'Set a channel to log join/leaves in a server',
            aliases : ['joinlog', 'jl'],
            parameters : 'channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings joinlogs <channel>\nExample: settings joinlogs #joins-leaves'
        },
        {
            name : 'settings kickdm'
        },
        {
            name : 'settings reset',
            description : 'Reset moderation configuration',
            aliases : ['clear'],
            information : `${emojis.warn} Administrator`,
            usage : 'Syntax: settings reset'
        },
        {
            name : 'settings invoketempbanmessage',
            description : 'Set a custom invoke tempban message',
            aliases : ['invoketempbanmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invoketempbanmessage <message or embed code>\nExample: settings invoketempbanmessage Something here idk' 
        },
        {
            name : 'settings jail',
            description : 'Set jail channel for moderation module',
            parameters : 'channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings jail <channel>\nExample: settings jail #jail'
        },
        {
            name : 'settings invokeunbanmessage',
            description : 'Set a custom invoke unban message',
            aliases : ['invokeunbanmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokeunbanmessage <message or embed code>\nExample: settings invokeunbanmessage Something here idk' 
        },
        {
            name : 'settings boosts',
            description : 'Set up boost messages in one or multiple channels',
            aliases : ['boost'],
            parameters : 'typee, channel, message',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings boosts <add or remove> <channel> <message or embed code>\nExample: settings boosts add #hi Thanks {user.mention}!',
            pages : [
                {
                    name : 'settings boosts variables',
                    description : 'View all available variables for boosts messages',
                    aliases : ['vars'],
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: settings boosts variables'
                },
                {
                    name : 'settings boosts list',
                    description : 'View all nitro boosts messages',
                },
                {
                    name : 'settings boosts remove'
                },
                {
                    name : 'settings boosts add'
                },
                {
                    name : 'settings boosts view'
                }
            ]
        },
        {
            name : 'settings joinmsg',
            description : 'Set a join message for new members',
            aliases : ['joinmessage', 'joindm'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings joinmsg <text>\nExample: settings joinmsg welcome bra'
        },
        {
            name : 'settings verifiedrole',
            description : 'Set the role for when members pass browser verification',
            aliases : ['verified', 'verifyrole'],
            parameters : 'role',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings verifiedrole <role>\nExample: settings verifiedrole @Member'
        },
        {
            name : 'settings invokesoftbanmessage',
            description : 'Set a custom invoke softban message',
            aliases : ['invokesoftbanmsg'],
            parameters : 'msg',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings invokesoftbanmessage <message or embed code>\nExample: settings invokesoftbanmessage Something here idk' 
        },
        {
            name : 'settings verifiedchannel',
            description : 'Set the channel to begin browser verification',
            aliases : ['verifychannel'],
            parameters : 'channel',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings verifiedchannel <channel>\nExample: settings verifiedchannel #verify'
        },
        {
            name : 'settings userskin',
            description : 'Enable or disable donator-only userskins',
            parameters : 'setting',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: settings userskin (on or off)\nExample: settings userskin on'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Settings
     */

    run: async (client, message, args) => {
        const parameter = args[0]
        const commands = ['sm','sticky','stickymessage','imgonly','baserole', 'baseid', 'config', 'list', 'configuration', 'autonick','welcome', 'joinlogs','joinlog','jl']
        const settings = client.commands.get('settings')
        try {
            const helpSettings = new MessageEmbed().setAuthor({
                name: `raven help`,
                iconURL: 'https://raven.bot/img/bot_avatar_default.png'
            }).setTitle(`Command: ${settings.name}`).setDescription(`${settings.description}\`\`\`${settings.usage}\`\`\``).setColor('#718090')
            if (!parameter || !commands.includes(parameter)) return message.channel.send({
                embeds: [helpSettings]
            })
            if (args[0] === 'stickymessage' || args[0] === 'sticky' || args[0] === 'sm') {
                if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name : 'raven help', iconURL : 'https://raven.bot/img/bot_avatar_default.png' }).setColor(colors.help).setTitle('Command: settings stickymessage').setDescription(`Set up a sticky message in one or multiple channels\`\`\`Syntax: ${prefix}settings stickymessage (subcommand) <args>\nExample: ${prefix}settings stickymessage add #channel hello\`\`\``)] })
                if (args[1] === 'list') {

                } else if (args[1] === 'add') {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args[2]))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[2]}**`).setColor(colors.warn)] })
                    const msg = args.slice(3).join(' '); if (!msg) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing a **message** to set for the **sticky message**`).setColor(colors.warn)] })
                    await stickymessage.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) {
                            new stickymessage({ guild : message.guild.id, stickyMessages : [{ channel : channel.id, message : msg }] }).save();
                            message.channel.send(`${msg}`).then(async (x) => db.set(`${channel.id}`, x.id))
                        } else {
                            const array = []; await data.stickyMessages.map(async(item) => { array.push(item.channel) })
                            if (array.includes(channel.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: Theres already a **sticky message** for this channel, you can't have multiple for one channel. Remove the current **sticky message** then try again.`).setColor(colors.deny)] })
                            data.stickyMessages.push({ channel : channel.id, message : msg }); await stickymessage.findOneAndUpdate({ guild: message.guild.id }, data);
                            channel.send(`${msg}`).then(async (x) => db.set(`${channel.id}`, x.id))
                        }
                    })
                } else if (args[1] === 'remove' || args[1] === 'delete' || args[1] === 'del') {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args.slice(2).join(' ')))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args.slice(2).join(' ')}**`).setColor(colors.warn)] })
                    await stickymessage.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **sticky message** exists for ${channel}`).setColor(colors.warn)] })
                        const array = []; await data.stickyMessages.map(async(item) => { array.push(item.channel) })
                        if (!array.includes(channel.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **sticky message** exists for ${channel}`).setColor(colors.warn)] })
                        data.stickyMessages = data.stickyMessages.filter(item => item.channel !== channel.id) 
                        await stickymessage.findOneAndUpdate({ guild: message.guild.id }, data);    
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed the **sticky message** for ${channel}`).setColor(colors.approve)] })         
                    })
                } else if (args[1] === 'view') {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args.slice(2).join(' ')))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args.slice(2).join(' ')}**`).setColor(colors.warn)] })
                    await stickymessage.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author}: No **sticky message** exists for ${channel}`).setColor(colors.raven)] })
                        const array = []; data.stickyMessages.map((item) => { array.push(item.channel) })
                        if (!array.includes(channel.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author}: No **sticky message** exists for ${channel}`).setColor(colors.raven)] })
                        data.stickyMessages.forEach(async (item) => {
                            if (item.channel === channel.id) {
                                message.channel.send(`${item.message}`)
                            }
                        })
                    })
                }
            }
            if (args[0] === 'imgonly') {
                if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name : 'raven help', iconURL : 'https://raven.bot/img/bot_avatar_default.png' }).setColor(colors.help).setTitle('Command: settings imgonly').setDescription(`Set up image + caption only channels\`\`\`Syntax: ${prefix}settings imgonly <add or remove> <channel>\nExample: ${prefix}settings imgonly add #submissions\`\`\``)] })
                if (args[1] === 'list') {
                    await imgonly.findOne({ guild : message.guild.id }).then(async(data) => {
                        if (!data || data.channels.length === 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:mag_right: ${message.author}: No **image only channels** are set`).setColor(colors.raven)] })
                        const embeds = [];
                        let imgonlyIndex = 0;
                        const imgonlyChannels = data.channels.pager(10);
                        imgonlyChannels.forEach((page) => {
                            const list = page.map((item) => { return `\`${++imgonlyIndex}\` **${client.channels.cache.get(item.channel) ? client.channels.cache.get(item.channel) : 'Deleted Channel'}** (\`${item.channel}\`)`}).join("\n");
                            embeds.push(new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) }).setTitle('Image only channels').setColor(message.member.displayHexColor).setDescription(list).setFooter({ text : `Page 1/1 (${imgonlyIndex} ${imgonlyIndex === 1 ? 'entry' : 'entries'})` }));
                        });
                        if (embeds.length > 1) { await pagination(message, embeds, imgonlyChannels.length, imgonlyIndex, ` (${imgonlyIndex} ${imgonlyIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [embeds[0]] });}
                    })
                } else if (args[1] === 'remove' || args[1] === 'delete' || args[1] === 'del') {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args.slice(2).join(' ')))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args.slice(2).join(' ')}**`).setColor(colors.warn)] })
                    await imgonly.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: ${channel} is not configured as an **image only channel**`).setColor(colors.deny)] })
                        const array = []; await data.channels.map(async(item) => { array.push(item.channel) })
                        if (!array.includes(channel.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${channel} is not configured as an **image only channel**`).setColor(colors.deny)] })
                        data.channels = data.channels.filter(item => item.channel !== channel.id) 
                        await imgonly.findOneAndUpdate({ guild: message.guild.id }, data);    
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: ${channel} is no longer an **image only channel**`).setColor(colors.approve)] })         
                    })
                } else if (args[1] === 'add' || args[1] === 'create') {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args.slice(2).join(' ')))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args.slice(2).join(' ')}**`).setColor(colors.warn)] })
                    await imgonly.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) {
                            new imgonly({ guild : message.guild.id, channels : [{ channel : channel.id }] }).save();
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: ${channel} is now an **image only channel**`).setColor(colors.approve)] })
                        } else {
                            const array = []; await data.channels.map(async(item) => { array.push(item.channel) })
                            if (array.includes(channel.id)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: ${channel} is already configured as an **image only channel**`).setColor(colors.deny)] })
                            data.channels.push({ channel : channel.id }); await imgonly.findOneAndUpdate({ guild: message.guild.id }, data);
                            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: ${channel} is now an **image only channel**`).setColor(colors.approve)] })
                        }
                    })
                }
            }
            if (parameter === 'joinlogs' || parameter === 'joinlog' || parameter === 'jl') {
                if (!args[1]) {
                    await joinlogs.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I couldn't find a \`#join-log\` channel, try setting it by mentioning the channel`).setColor(colors.warn)] })
                        await joinlogs.findOneAndDelete({ guild : message.guild.id })
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed \`#join-log\`'s binded channel`).setColor(colors.approve)] })
                    })
                } else if (args[1]) {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(channel => channel.name.includes(args[1]))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)] })
                    await joinlogs.findOne({ guild : message.guild.id }).then(async (data) => {
                        if (!data) {
                            new joinlogs({ guild : message.guild.id, channel : channel.id }).save()
                            message.react('✅')
                            channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} \`#join-log\` is now bound to this channel. (\`${channel.id}\`)`).setColor(colors.approve)] })
                        } else {
                            await joinlogs.findOneAndUpdate({ guild : message.guild.id, channel : data.channel }, { guild : message.guild.id, channel : channel.id })
                            message.react('✅')
                            channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} \`#join-log\` is now bound to this channel. (\`${channel.id}\`)`).setColor(colors.approve)] })

                        }
                    })
                }
            }
            if (parameter === 'welcome') {
                const welcomeCommands = ['variables','vars','list','remove','delete','del','add','create','view','check']
                if (!args[1] || !welcomeCommands.includes(args[1])) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png'}).setTitle(`Command: settings welcome`).setDescription(`Set up a welcome message in one or multiple channels\`\`\`Syntax: settings welcome (subcommand) <args> --params\nExample: settings welcome add #hi Hi {user.mention}! --self_destruct 10\`\`\``).setColor('#718090')] })
                if (args[1] === 'variables' || args[1] === 'vars') {
                    return message.channel.send({ embeds : [new MessageEmbed().setDescription(`:information_source: ${message.author}: You can view all **variables** here: https://docs.raven.bot/bot/embed-code-variables/variables`).setColor('#668bdb')] })
                } else if (args[1] === 'list') {
                    return message.channel.send(`Doing this later - when welcome add is done.`)
                } else if (args[1] === 'remove' || args[1] === 'delete' || args[1] === 'del') {

                } else if (args[1] === 'add' || args[1] === 'create') {
                    let argumentsIndex = 0
                    let split = []
                    if (!args[2]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png'}).setTitle(`Command: settings welcome add`).setDescription(`Add a welcome message for a channel\`\`\`Syntax: settings welcome add (channel) (message) --params\nExample: settings welcome add #hi Hi {user.mention}! --self_destruct 10\`\`\``).setColor('#718090')] })
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find((channel) => channel.name.includes(args[2]))
                    if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[2]}**`).setColor(colors.warn)] })
                    if (!args[3] || args[3] === '--self_destruct') return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing a **message** to output join messages in a channel`).setColor(colors.warn)] })
                    args.forEach((m) => { ++argumentsIndex
                    if (m === '--self_destruct') { split.push(argumentsIndex) }})
                    const selfdestruct = args.slice(split[0])
                    if (Number(selfdestruct) > 60) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your **self-destruct** timer can't be longer than \`60\` seconds`)] })
                    const welcome = split.length === 0 ? args.slice(3) : args.slice(3, split[0] - 1).join(' ')
                    if (await welcomeSchema.findOne({ guild : message.guild.id, channel : channel.id })) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: Theres already a **join message** for this channel, you can't have multiple for one channel. Remove the current **join message** then try again.`).setColor(colors.deny)] })
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Created a **join message** and set the join channel to ${channel}\n${split.length !== 0 ? `Every **join message** will self-destruct after \`${selfdestruct}\` seconds` : ''}`).setColor(colors.approve)] })
                    new welcomeSchema({ guild : message.guild.id, message : welcome.toString(), self_destruct : split.length !== 0 ? Number(selfdestruct + '000') : false, channel : channel.id }).save()
                }
            } else
            if (parameter === 'config' || parameter === 'list' || parameter === 'configuration') {
                let jail = 'N/A', jailData = await jailSchema.findOne({ guildId: message.guild.id })
                jailData !== null ? jail = `<#${jailData.channel}>` : null
                let jaillog = 'N/A', jaillogData = await jaillogSchema.findOne({ guildId: message.guild.id })
                jaillogData !== null ? jaillog = `<#${jaillogData.channel}>` : null         
                let baserole = 'N/A', baseroleData = await baseroleSchema.findOne({ guildId: message.guild.id })       
                baseroleData !== null ? baserole = `<@&${baseroleData.baseroleId}>` : null         
                let autonick = emojis.deny, autonickData = await autonickSchema.findOne({ guild : message.guild.id })
                autonickData !== null ? autonick = emojis.approve : null
                const config = new MessageEmbed()
                .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
                .setTitle(`Settings`)
                .setDescription(`Prefix for **${message.guild.name}** is \`,\``)
                .addField(`**Modules**`, `**Antiraid:** N/A\n**Antinuke:** N/A\n**Starboard:** N/A\n**Clownboard:** N/A\n**Reaction Roles:** N/A\n**Google Safe Mode:** N/A\n**Twitter Stream:** N/A\n**Subreddit Stream:** N/A\n**Autonick:** ${autonick}`, true)
                .addField(`**General**`, `**Join Message:** N/A\n**Jail Message:** N/A\n**Custom Punish Messages:** 0\n**Welcome Messages:** 0\n**Goodbye Messages:** 0\n**Word Filter Count:** 0\n**Snipe Filter Count:** 0\n**Other Filter Count:** 0\n**Disabled Commands:** 0\n**Disabled Events:** 0\n**Disabled Modules:** 0\n**Restricted CMDS:** 0`, true)
                .addField(`**Channels & Roles**`, `**Jail:** ${jail}\n**Join-log:** N/A\n**Mod-log:** ${jaillog}\n**Starboard:** N/A\n**Clownboard:** N/A\n**Base Role:** ${baserole}\n**Verified Role:** N/A`, true)
                .setColor('#7189da')
                message.channel.send({ embeds : [config] })
            }
            if (parameter === 'baserole' || parameter === 'baseid') {
                const baseroleData = await baseroleSchema.findOne({
                    guildId: message.guild.id
                })
                if (args[1]) {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                    const invalidRole = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args.slice(1).join(' ')}**`).setColor(colors.warn)
                    if (!role) return message.channel.send({
                        embeds: [invalidRole]
                    })
                    if (baseroleData) {
                        await baseroleSchema.findOneAndUpdate({
                            guildId: message.guild.id
                        }, {
                            guildId: message.guild.id,
                            baseroleId: role.id
                        })
                        const setBaserole = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Updated ${role} as the **base role**`).setColor(colors.approve)
                        return message.channel.send({
                            embeds: [setBaserole]
                        })
                    } else {
                        const newBaserole = new baseroleSchema({
                            guildId: message.guild.id,
                            baseroleId: role.id
                        })
                        newBaserole.save()
                        const setBaserole = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set ${role} as the **base role**`).setColor(colors.approve)
                        return message.channel.send({
                            embeds: [setBaserole]
                        })
                    }
                } else {
                    if (baseroleData) {
                        const resetBaserole = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed the current **base role**`).setColor(colors.approve)
                        message.channel.send({
                            embeds: [resetBaserole]
                        })
                        return await baseroleSchema.findOneAndDelete({
                            guildId: message.guild.id
                        })
                    } else {
                        const resetBaserole = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed the current **base role**`).setColor(colors.approve)
                        message.channel.send({
                            embeds: [resetBaserole]
                        })
                    }
                }
            } else if (args[0] === 'autonick') {
                const nick = args.slice(1).join(' ')
                if (nick) { 
                    await autonickSchema.findOne({ guild : message.guild.id }) ? 
                    await autonickSchema.findOneAndDelete({ guild : message.guild.id }).then(() => 
                    new autonickSchema({ guild : message.guild.id, nickname : nick }).save()
                    .then(() => 
                    message.channel.send({ 
                        embeds : [
                            new MessageEmbed()
                            .setDescription(`${emojis.approve} ${message.author}: Autonick **set** to ${nick}`)
                            .setColor(colors.approve)] }))) : 
                            new autonickSchema({
                                 guild : message.guild.id, nickname : nick })
                                 .save()
                                 .then(() => 
                                 message.channel.send({ embeds : [
                                    new MessageEmbed()
                                    .setDescription(`${emojis.approve} ${message.author}: Autonick **set** to ${nick}`)
                                    .setColor(colors.approve)] })) 
                                } else if (!nick) { 
                                    await autonickSchema.findOne({ guild : message.guild.id }) ? 
                                    await autonickSchema.findOneAndDelete({ guild : message.guild.id }).then(() => message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed the **autonick**`).setColor(colors.approve)] })) : message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I couldn't find a configured **autonick**`).setColor(colors.warn)] }) }
            } else if (args[0] === 'joinmsg' || args[0] === 'joinmessage' || args[0] === 'joindm') {
                const message = args.slice(1).join(' ')
            }
        } catch (error) {
            return console.log(error);
        }
    },
};