const {
    MessageEmbed
} = require('discord.js');
const config = require('../../Data/config.json')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const error = require('../../Models/errors')

const { pagination } = require('../../Functions/newpag.js')
module.exports = {
    name: 'eval',
    aliases: ['evaluate'],
    run: async (client, message, args) => {
        //return;p
        let staff = ['944099356678717500','944099356678717500']
        if (!staff.includes(message.author.id)) return message.channel.send('nah')
        const owner = client.users.cache.get(`${config.ownerid}`)
                try {
                    const code = args.slice(0).join(" ").replace('`', '')
                if (!code) { return message.channel.send("Nig put it some code u monke"); }
                let evaled = await eval(code);
                if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                code.length > 20 ? message.react('▶️') : null
                message.react('✅')
                //if (!evaled === 'Promise { <pending> }')
                message.channel.send(`${evaled}`)
                } catch (error) {
                    message.react('‼️')
                    console.log(error.message)
                }
    }
}