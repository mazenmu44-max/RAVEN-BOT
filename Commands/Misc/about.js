const { MessageEmbed } = require('discord.js')
const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
module.exports = {
    name : 'about',
    description : 'View information about raven',
    aliases : ['botinfo', 'bleedinfo'],
    usage : 'Syntax: about',
    module : 'misc',
    
    run : async (client, message, args) => {
        let commandsSize = []
        let unique = []
        let uniqueonline = []

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        client.commands.forEach((command) => { if (command.pages) { command.pages.forEach((page) => { commandsSize.push(page) }) } else if (command.commands) { command.commands.forEach((cmd) => {commandsSize.push(cmd)}) }})

        for (const guild of client.guilds.cache.values()) {
            for (const member of guild.members.cache.values()) {
                if (member.presence && member.presence.status !== 'offline') {
                unique.push(member)
                } 
            }
        }
        for (const guild of client.guilds.cache.values()) {
            for (const member of guild.members.cache.values()) {
                if (member.presence) {
                    for (const i of member.presence.activities) {
                        uniqueonline.push(member)
                    }
                }
            }
        }
        let total = 0; for (const guild of client.guilds.cache.values()) { total = total + guild.memberCount };
        const about = new MessageEmbed()
        //.setTitle('Information').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        //.setAuthor({ name : client.user.username.toString(), iconURL : client.user.displayAvatarURL({ dynamic : true, size : 1024 }) })
        .setDescription(`Developer: **${config.ownertag}**, Memory: **${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB**, Commands: **${client.commands.size + client.aliases.size + commandsSize.length}**`)
        .addField(`**Cached Statistics**`, `Members: **${parseInt(total).toLocaleString()}** total (**${parseInt(unique.length).toLocaleString()}** unique & **${parseInt(uniqueonline.length).toLocaleString()}** unique online)\nChannels: **${parseInt(client.channels.cache.size).toLocaleString()}** total (**${parseInt(client.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size).toLocaleString()}** text & **${parseInt(client.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size).toLocaleString()}** voice)\nGuilds: **${parseInt(client.guilds.cache.size).toLocaleString()}** (private)`)
        //./addField(`**Members**`, `${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} total\n${unique.length} unique\n${uniqueonline.length} unique online`, true)
        //.addField(`**Channels**`, `${client.channels.cache.size} total\n${client.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size} text\n${client.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size} voice`, true)
        //./addField(`**Guilds**`, `${client.guilds.cache.size} (private)`, true)
        .addField(`**Information**`, `Message cache capped at **1000**, presences intent is **enabled**, \nmembers intent is **enabled**, and message content intent is **disabled**.`, )
        .setFooter({ text : `Average websocket latency: ${client.ws.ping}ms, Uptime: ${days ? `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : minutes ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` }` })
        .setColor(colors.color)
        message.channel.send({       embeds : [about] })
    },
};