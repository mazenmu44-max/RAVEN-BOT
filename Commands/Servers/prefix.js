const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')
const prefixes = require('../../Models/Servers/prefixes')

module.exports = {
    name : 'prefix',
    description : 'View guild prefix',
    module : 'servers',
    pages : [
        {
            name : 'prefix set',
            description : 'Set command prefix for guild',
            aliases : ['add'],
            parameters : 'pre',
            information : `${emojis.warn} Administrator`,
            usage : 'Syntax: prefix set <prefix>\nExample: prefix set !'       
        },
        {
            name : 'prefix remove',
            description : 'Remove command prefix for guild',
            aliases : ['delete', 'del', 'clear'],
            information : `${emojis.warn} Administrator`,
            usage : 'Syntax: prefix remove'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Prefix
     */

    run : async (client, message, args, prefix) => {
        const commands = ['set', 'add', 'remove', 'delete', 'del', 'clear']
        if (!args[0] || !commands.includes(args[0])) {
            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`Your guild's **prefix** is: \`${prefix || ','}\``).setColor(colors.color)] })
        } else if (args[0] === 'set' || args[0] === 'add') {
            if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`administrator\``).setColor(colors.warn)]})
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: prefix set').setDescription(`Set command prefix for guild\`\`\`Syntax: ${prefix}prefix set <prefix>\nExample: ${prefix}prefix set !\`\`\``).setColor('#718090')] })
            if (args[1].length > 10) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your **prefix** cannot be longer than **10 characters**!`).setColor(colors.warn)] })
            await prefixes.findOne({ guild : message.guild.id }).then(async(data) => {
                if (data) {
                    await prefixes.findOneAndRemove({ guild : message.guild.id })
                    new prefixes({ guild : message.guild.id, prefix : args[1] }).save()
                    return message.channel.send({ embeds : [new MessageEmbed().setDescription(`Your guild's prefix has been **updated** to \`${args[1]}\``).setColor(colors.color)]})
                } else {
                    new prefixes({ guild : message.guild.id, prefix : args[1] }).save()
                    return message.channel.send({ embeds : [new MessageEmbed().setDescription(`Your guilds's prefix has been **set** as \`${args[1]}\``).setColor(colors.approve)]})     
                }
            })
        } else if (args[0] === 'remove' || args[0] === 'delete' || args[0] === 'del' || args[0] === 'clear') {
            if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`administrator\``).setColor(colors.warn)]})
            await prefixes.findOneAndRemove({ guild : message.guild.id }).catch(() => { null })
            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`Your guild's prefix has been **removed** and has been reset to the **default** prefix.`).setColor(colors.color)] })
        }
    },
};