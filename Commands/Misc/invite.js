const { MessageActionRow, MessageButton,MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
module.exports = {
    name : 'invite',
    run : async (client, message, args) => {
        message.channel.send(`If your server is **authorized**, add **${client.user.username}** here: **https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands**`)
    }
}