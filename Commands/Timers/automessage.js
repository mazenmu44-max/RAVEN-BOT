const { MessageEmbed } = require('discord.js')
const ms = require('ms')
const prettyms = require('pretty-ms')

const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')

const automessageSchema = require('../../Models/Timers/automessage');

module.exports = {
    name : 'automessage',
    description : 'Post repeating messages in your server',
    aliases : ['timer', 'timers', 'automsg'],
    usage : 'Syntax: automessage (subcommand) <args>\nExample: automessage add #general 2h hey sexy ass people',
    module : 'timers',
    pages : [
        {
            name : 'automessage view',
            description : 'Preview a channels auto message',
            aliases : ['check'],
            parameters : 'channel',
            usage : 'Syntax: automessage view (channel)\nExample: automessage view #joneral'
        },
        {
            name : 'automessage add',
            description : 'Add repeating message to a channel',
            aliases : ['create', 'send'],
            parameters : 'channel, interval, message',
            usage : 'Syntax: automessage add (channel) (interval) <message>\nExample: automessage add #general 2h hey sexy ass people'
        },
        {
            name : 'automessage remove',
            description : 'Remove repeating message from a channel',
            aliases : ['delete', 'del'],
            parameters : 'channel',
            usage : 'Syntax: automessage remove (channel)\nExample: automessage remove #general'
        },
        {
            name : 'automessage list',
            description : 'View all auto messages in your server',
            usage : 'Syntax: automessage list'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Automessage
     */


    run : async (client, message, args) => {
        const command = args[0]
        const commands = ['view','check','add','create','send','remove','delete','del','list']
        const automessage = client.commands.get('automessage')
        try {
            const helpAutomessage = new MessageEmbed().setAuthor({name : `raven help`, iconURL : 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png'}).setTitle(`Command: ${automessage.name}`).setDescription(`${automessage.description}\`\`\`${automessage.usage}\`\`\``).setColor('#718090')
            if (!command || !commands.includes(command)) return message.channel.send({ embeds : [helpAutomessage] })
            if (command === 'view' || command === 'check') {
                const helpAutomessageView = new MessageEmbed().setAuthor({name : `raven help`, iconURL : 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png'}).setTitle(`Command: ${automessage.pages[0].name}`).setDescription(`${automessage.pages[0].description}\`\`\`${automessage.pages[0].usage}\`\`\``).setColor('#718090')
                if (!args[1]) return message.channel.send({ embeds : [helpAutomessageView]  })
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                const nochannelfound = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)
                if (!channel) return message.channel.send({ embeds : [nochannelfound] })
                const viewData = await automessageSchema.findOne({ guild: message.guild.id, channel: channel.id })
                const noautomessageexists = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **auto message** found for ${channel}`).setColor(colors.warn)
                if (!viewData) return message.channel.send({ embeds : [noautomessageexists] })
                message.channel.send(`${viewData.message}`)
            } else if (command === 'add' || command === 'create' || command === 'send') {
                const helpAutomessageAdd = new MessageEmbed().setAuthor({name : `raven help`, iconURL : 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png'}).setTitle(`Command: ${automessage.pages[1].name}`).setDescription(`${automessage.pages[1].description}\`\`\`${automessage.pages[1].usage}\`\`\``).setColor('#718090')
                const channel = args[1], interval = args[2], msg = args.slice(3).join(' ')
                if (!channel || !interval || !msg) return message.channel.send({ embeds : [helpAutomessageAdd]  })
                const chan = message.mentions.channels.first() || message.guild.channels.cache.get(channel)
                const nochannelfound = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${channel}**`).setColor(colors.warn)
                if (!chan) return message.channel.send({ embeds : [nochannelfound] })
                const notlongEnough = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your message must contain more than **7 characters**!`).setColor(colors.warn)
                if (msg.length < 7) return message.channel.send({ embeds : [notlongEnough] })
                const seconds = ms(interval)
                const invalidTimer = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid **time passed** - make sure you format like this: \`1h\` \`5m\` or \`30s\``).setColor(colors.warn)
                if (!seconds) return message.channel.send({ embeds : [invalidTimer] })
                const intervalInvalid = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your timer's interval must be longer than **30 minutes** (\`1800 seconds\`)`).setColor(colors.warn)
                if (seconds < 1800000) return message.channel.send({ embeds : [intervalInvalid] })
                const longtime = prettyms(seconds, {verbose: true}).replace('hours', 'hour').replace('minutes', 'minute').replace('days', 'day')
                const newAutomessage = new MessageEmbed().setDescription(`${message.author}: A new auto message with **${longtime}** interval has been added to ${chan}. You can preview your message by running \`,automessage view #${chan.name}\`.`).setColor('#7189da')
                const automessageData = await automessageSchema.findOne({ guild : message.guild.id, channel : chan.id })
                const alreadyExists = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: An **auto message** already exists for ${chan}`).setColor(colors.warn)
                if (automessageData) return message.channel.send({ embeds : [alreadyExists] })
                message.channel.send({ embeds : [newAutomessage] })
                new automessageSchema({ guild : message.guild.id, channel : chan.id, message : msg, interval : seconds }).save()
                setTimeout(async () => { setInterval(async () => { message.channel.send(`${msg}`) }, seconds) }, seconds)
            } else if (command === 'remove' || command === 'delete' || command === 'del') {

            } else if (command === 'list') {

            }
        } catch (error) {
            return console.log(error);
        }
    },
};