const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'ar',
    description: 'start a poll',
    aliases: ['p', 'startpoll'],
    run : async (client, message, args) => {
        if (args[0] && args[0] === 'add') {
            let option1Text = ''
        var option2Text = ''
        var argIndex = 0
        var argStatus = false;
        for (const arg of args) { ++argIndex
            if (arg.endsWith(',')) { 
                if (argStatus) return;
                argStatus = true;
                option1Text = args.slice(1, argIndex).join(' ')
                option2Text = args.slice(argIndex).join(' ')
            }
        }
        let option1Text2 = option1Text.slice(' ')
        option1Text2 = option1Text2.replace(',', '')
        message.channel.send(`**TRIGGER:** ${option1Text2}\n**RESPONSE:** ${option2Text}`)
        }
    }
}