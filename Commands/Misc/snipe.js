const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors') 
const pagination = require('../../Functions/pagination')

module.exports = {
    name : 'snipe',
    description : 'Snipe the latest message that was deleted',
    aliases : ['s'],
    parameters : 'channel',
    usage : 'Syntax: snipe <channel>\nExample: snipe #joneral',
    module : 'misc',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Snipe
     */

    run : async (client, message, args) => {
        const embeds = []; const channel = message.mentions.channels.first() || message.channel
        const snipes = client.snipes.get(channel.id); if (!snipes) return;
        let index = 0
        snipes.forEach(async (snipe) => {
            console.log(snipe)
            let delta = Math.abs(new Date() - snipe.timestamp) / 1000; let days = Math.floor(delta / 86400); delta -= days * 86400;  let hours = Math.floor(delta / 3600) % 24; delta -= hours * 3600; let minutes = Math.floor(delta / 60) % 60; delta -= minutes * 60; let seconds = delta % 60; seconds < 10 ? seconds = Number(seconds.toString().slice(0, 1)) : seconds = Number(seconds.toString().slice(0, 2))
            const embed = new MessageEmbed().setColor(colors.color)
            .setAuthor({ name : `ok`, iconURL : snipe.author.displayAvatarURL({ dynamic : true }) })
            .setDescription(`${snipe.content}`).setFooter({ text : `${days === 0 ? hours === 0 ? minutes === 0 ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`} ago, Index ${++index} of ${snipes.length}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
            embeds.push(embed)
        })
        if (embeds.length > 1) {
            await pagination(message, embeds, embeds.length, embeds.length)
        } else {
            message.channel.send({ embeds : [embeds[0]] })
        }
    }
}