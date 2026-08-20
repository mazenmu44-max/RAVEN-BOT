const timezone = require('../../Models/Information/timezone')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const { find } = require('geo-tz')
const moment = require('moment-timezone')
const axios = require('axios')

module.exports = {
    name : 'timezone',
    description : 'View your current time or somebody elses',
    aliases : ['tz', 'time'],
    parameters : ['member'],
    usage : { syntax : 'timezone (member)', example : `timezone ${config.ownertag}` },
    module : 'information',
    commands : [
        {
            name : 'timezone list',
            description : 'View a list of every member\'s timezone',
            aliases : ['view'],
            usage : { syntax : 'timezone list' }
        },
        {
            name : 'timezone set',
            description : 'Set your timezone',
            parameters : ['location'],
            usage : { syntax : 'timezone set (location)', example : 'timezone set Los Angeles' },
        }
    ],
    run : async (client, message, args, prefix) => {
        const commands = ['list', 'view', 'set']
        if (args[0] && commands.includes(args[0])) {
            if (args[0] === 'list' || args[0] === 'view') {

            } else if (args[0] === 'set') {
                const location = args.slice(1).join('-')
                if (!location) return;
                const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=bb436a823ae4337d389eb9e2622aba21`)
                if (!result || result.data.length == 0) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **location** found for \`${args.slice(1).join(' ')}\``).setColor(colors.warn)] })
                const tz = find(result.data[0].lat, result.data[0].lon)[0]
                await timezone.findOne({ user : message.author.id }).then(async (data) => {
                    if (!data) {
                        new timezone({ user : message.author.id, location : tz }).save()
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Your **timezone** has been set to \`${tz}\``).setColor(colors.approve)] })
                    } else {
                        await timezone.findOneAndUpdate({ user : message.author.id, location : data.location }, { user : message.author.id, location : tz })
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Your **timezone** has been set to \`${tz}\``).setColor(colors.approve)] })
                    }
                })
            }
        } else {
            try {
                const member = args[0] ? message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.includes(args.join(' '))) : message.member
                if (!member) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`I was unable to find a member with the name: **${args.join(' ')}**`).setColor(colors.warn)] })
                await timezone.findOne({ user : member.user.id }).then(async (data) => {
                    if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${member.user.id === message.author.id ? `Your **timezone** has not been set yet. Use \`${prefix}timezone set (location)\` to set it then try this command again.` : `**${member.user.tag}** does not have their **timezone** set.`}`).setColor(colors.warn)] })
                    var text = moment(new Date());
                    let tz = text.tz(data.location).format('MMMM DD, hh:mm A')
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${member.user.id === message.author.id ? `Your current time is **${tz}**` : `**${member.user.tag}**'s current time is **${tz}**`}`).setColor(colors.color)] })
                })
            } catch (error) {
                function token() { var tokenText = "";
                var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 13; i++) tokenText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                return tokenText; }; message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Error occurred while performing command **timezone**. Use this error code \`${token()}\` to report to the developers in the [support server](https://discord.gg/raven).`).setColor(colors.warn)] })
            }
        }
    },
};