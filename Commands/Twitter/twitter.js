const emojis = require('../../Data/emojis.json')
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags');
const twitter = require('twitter-api.js');
const config = require("../../Data/config.json");
const colors = require("../../Data/colors.json");
const moment = require('moment');
module.exports = {
    name : 'twitter',
    description : 'Check a twitter account profile or set up a stream to follow an accounts tweets',
    parameters : 'handle',
    usage : 'Syntax: twitter (subcommand) <args>\nExample: twitter @83by',
    module : 'twitter',
    pages : [
        {
            name : 'twitter color',
            description : 'Set default embed color for tweets',
            parameters : 'color',
            usage : 'Syntax: twitter color (hex code)\nExample: twitter color #ffffff'
        },
        {
            name : 'twitter add',
            description : 'Stream a twitter account\'s tweets into a channel',
            aliases : ['follow'],
            parameters : 'channel, handle, params',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: twitter add (channel) <handle> --params\nExample: twitter add #general @83by --replies_off'
        },
        {
            name : 'twitter remove',
            description : 'Remove a stream for a twitter account from a channel',
            aliases : ['delete', 'del'],
            parameters : 'channel, handle',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: twitter remove (channel) <handle> --params\nExample: twitter remove #general @83by'
        },
        {
            name : 'twitter tweet',
            description : 'make a tweet :P',
            parameters : 'tweet',
            information : `${emojis.warn} Exculsive`,
            usage : 'Syntax: twitter tweet (something to tweet)\nExample: twitter tweet raven bot #1'
        },
        {
            name : 'twitter list',
            description : 'View a list of every existing twitter stream',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: twitter list'
        },
        {
            name : 'twitter update',
            description : 'Update a current twitter account\'s stream settings',
            parameters : 'channel, handle, params',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: twitter update (channel) <handle> --params\nExample: twitter update #general @83by --replies_off'
        },
        {
            name : 'twitter message',
            description : 'Set a message when twitter posts are sent',
            parameters : 'message',
            information : `${emojis.warn} Manage Guild\n:notepad_spiral: Useful for role mentions only`,
            usage : 'Syntax: twitter message (message) --pingable (on or off)\nExample: twitter message @raven-stans --pingable on',
            pages : [
                {
                    name : 'twitter message view',
                    description : 'View current twitter message',
                    aliases : ['check'],
                    information : `${emojis.warn} Manage Guild`,
                    usage : 'Syntax: twitter message view'
                }
            ]
        }
    ],
    run : async (client, message, args, prefix) => {
        const commands = ['color','add','follow','remove','delete','del','tweet','list','update','message']
        if (!args[0]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: twitter').setDescription(`Check a twitter account profile or set up a stream to follow an accounts tweets\`\`\`Syntax: ${prefix}twitter (subcommand) <args>\nExample: ${prefix}twitter @83by\`\`\``).setColor(colors.help)] })

        if (!commands.includes(args[0])) {
            try {
                const body = await twitter.users(args[0]);
                message.channel.send({ 
                    embeds : [
                        new MessageEmbed()
                        .setColor('#119ce0')
                        .setURL(`https://twitter.com/${body.screen_name}`)
                        .setAuthor({ 
                            name : `${message.member.displayName}`, 
                            iconURL : message.author.displayAvatarURL({ dynamic : true }) })
                            .setTitle(`${body.name} (@${body.screen_name.toLocaleString()}) ${body.verified ? `☑️` : ''}`)
                            .setDescription(stripIndents`${body.description}`)
                            .setFooter({ 
                                text : `Joined ${moment(body.created_at).format("MMMM Do YYYY")}`, 
                            iconURL : 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png' })
                            .setThumbnail(body.profile_image_url_https.replace('_normal', ''))
                            .addField(`**Tweets**`, `${body.statuses_count.toLocaleString()}`, true)
                            .addField(`**Following**`, `${body.friends_count.toLocaleString()}`, true)
                            .addField(`**Followers**`, `${body.followers_count.toLocaleString()}`, true)] })
            } catch (error) {
                if (error.status === 403) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: [**@${args[0]}**](https://twitter.com/${args[0]}) is suspended`).setColor(colors.warn)] })
                if (error.status === 404) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: [**@${args[0]}**](https://twitter.com/${args[0]}) doesn't exist`).setColor(colors.warn)] })
            }
        } else if (args[0] === 'color') {

        } else if (args[0] === 'add' || args[0] === 'follow') {

        } else if (args[0] === 'remove' || args[0] === 'delete' || args[0] === 'del') {

        } else if (args[0] === 'tweet') {

        } else if (args[0] === 'list') {

        } else if (args[0] === 'update') {

        } else if (args[0] === 'message') {
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: twitter message').setDescription(`Set a message when twitter posts are sent\`\`\`Syntax: ${prefix}twitter message (message) --pingable (on or off)\nExample: ${prefix}twitter message @raven-stans --pingable on\`\`\``).setColor(colors.help)] })
        }
    },
};