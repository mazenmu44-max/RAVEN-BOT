const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')

module.exports = {
    name : 'welcome',
    usage : { syntax : '(subcommand) (arguments)', example : 'welcome add #channel {embed}$v{title: welcome}' },
    description : 'Create welcome messages to greet new members',
    run : async (client, message, args, prefix) => {
        const commands = ['add', 'create']
        if (!args[0] || !commands.includes(args[0])) return await new client.help(message, prefix, client).send(client.commands.get('welcome'))
    }
}