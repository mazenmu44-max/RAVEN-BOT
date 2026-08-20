const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json') 
module.exports = {
    name : 'uptime',
    hidden : true,
    run : async (client, message, args) => {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        const uptime = new MessageEmbed()
        .setDescription(`<:f_alarmclock:970783727733063740> Uptime: **${days ? `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : minutes ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` }** (Module was loaded <t:${Math.floor(client.readyTimestamp / 1000)}:R>)`)
        .setColor(colors.color)
        message.channel.send({ embeds : [uptime] })
    }
}