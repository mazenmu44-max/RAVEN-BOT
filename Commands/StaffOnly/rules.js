const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'serverrules',
    run : async (client, message, args) => {
        await message.delete()
        if (message.author.id !== '917210373051011142') return;
        const bleedwin = new MessageEmbed().setTitle('raven.win').setURL('https://raven.win/').setColor(colors.help)
        message.channel.send({ embeds : [bleedwin] })
        const serverrules1 = new MessageEmbed().setAuthor({ name : 'SERVER RULES' }).setDescription(`*this server has no jail. mods can and will ban on first offense.*\nas always, please follow the [Discord’s Terms of Service](https://discordapp.com/tos)`).addField(`${emojis.warn} **BE COURTEOUS**`, `> respect everyone including staff members and be civil.`).addField(`${emojis.warn} **NO SLURS**`, `> don't use bigoted language with the intent to attack others or offend anyone.`).addField(`${emojis.warn} **KEEP CHANNELS ON TOPIC**`, `> try to discuss things in their appropriate channels, keep shitposting out of bot channels.`).setFooter({ text : `Page 1 of 2` }).setColor(colors.help)
        const e = new MessageEmbed().setDescription('Null').setColor(colors.help)
        const i = await message.channel.send({ embeds : [e] })
        i.edit({ embeds : [serverrules1] }).then(msg => {
            msg.react('⬅️')
            msg.react('➡️')
        })
        const edit = new MessageEmbed().setDescription('Null').setColor(colors.help)
        const msg = await message.channel.send({ embeds : [edit] })
        const notificationroles = new MessageEmbed().setAuthor({ name : 'NOTIFICATION ROLES' }).setDescription('indicate how you would like to be notified of server updates.\n\n*react with 📰 to receive notifications for __bot updates.__*\n*react with 🔨 to receive notifications for __important server info.__*\n*react with <:status_streaming:962037244095512686> to recieve notifications for __whenever nick streams__*').setColor(colors.help)
        msg.edit({ embeds : [notificationroles]  }).then(msg => {
            msg.react('📰')
            msg.react('🔨')
            msg.react('<:status_streaming:962037244095512686>')
        })
        const gainaccess = new MessageEmbed().setDescription(`react to this to **gain access** to the server`).setColor(colors.help)
        message.channel.send({ embeds : [gainaccess] }).then(msg => {
            msg.react('☑️')
        })
    }
}