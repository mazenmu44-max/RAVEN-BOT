const emojis = require('../../Data/emojis.json'), { MessageEmbed } = require('discord.js'), colors = require('../../Data/colors.json')
const cmds = require('../../Models/Servers/commands')
module.exports = {
    name : 'disablecommand',
    description : 'Disable a command in a channel',
    aliases : ['dcmd'],
    parameters : 'arg, command',
    permissions : ['MANAGE_CHANNELS'],
    information : `${emojis.warn} Manage Channels\n:notepad_spiral: Admins can bypass this restriction`,
    usage : 'Syntax: disablecommand (subcommand) <args>\nExample: disablecommand #spam ping',
    commands : [
        {
            name : 'disablecommand all',
            description : 'Disable a command in every channel',
            parameters : 'command',
            information : `${emojis.warn} Manage Channels\n:notepad_spiral: Admins can bypass this restriction`,
            usage : 'Syntax: disablecommand all <command>\nExample: disablecommand all image'
        }
    ],
    run : async (client, message, args, prefix) => {
        if (!args[0]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: disablecommand').setDescription(`Disable a command in a channel\`\`\`Syntax: disablecommand (subcommand) <args>\nExample: disablecommand #spam ping\`\`\``).setColor('#718090')] })
        const commands = ['all', 'list']
        if (!commands.includes(args[0])) {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find((channel) => channel.name.includes(args[0]))
            if (!channel) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid **channel** or **member** passed. Mention either one and try again.`).setColor(colors.warn)] })
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing a **command** to disable`).setColor(colors.warn)] })
            const command = client.commands.get(args[1]) || client.commands.get(client.aliases.get(args[1]));
            if (!command) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: Command \`${args[1]}\` does not exist`).setColor(colors.deny)] })
            if (command.name === 'disablecommand' || command.name === 'enablecommand') return message.channel.send('why would you do that')
            await cmds.findOne({ guild : message.guild.id, channel : channel.id, command : command.name }).then(async(cmd) => {
                if (cmd) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Command \`${command.name}\` is already disabled`).setColor(colors.warn)] })
                new cmds({ guild : message.guild.id, channel : channel.id, command : command.name }).save().then(() => {
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Disabled command \`${command.name}\` in channel ${channel}`).setColor(colors.approve)] })         
                })
            })
        } else if (args[0] === 'all') {

        } else if (args[0] === 'list') {

        }
    },
};