const colors = require('../../Data/colors.json'), { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'testthefuckingraid',
    run : async (client, message, args, prefix) => {
        message.delete()
        message.guild.channels.cache.forEach((channel)=>{
            if (channel.type === 'GUILD_TEXT') channel.send({ embeds : [new MessageEmbed().setDescription(`:lock: Raid detected - **channels** were placed on lockdown. New members are being **banned** as set in the configuration. Use \`unlock all\` or \`antiraid removeraid\` to disable this server's raid state.`).setColor(colors.warn)] }).catch(() => {})
        })
    }
}