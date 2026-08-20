const Levels = require("discord-xp");
const emojis = require('../../Data/emojis.json')
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const { Database } = require('quickmongo');
const db = new Database(config.mongoURI, `levelDb`);
module.exports = {
    name: 'rank',
    run : async (client, message, args) => {
        const user = await Levels.fetch(message.author.id, message.guild.id, true);
        const newxp = Levels.xpFor(parseInt(user.level) + 1);
        let index = await db.get(`level_${message.author.id}_${message.guild.id}`) || 0
        //message.channel.send(`${index} XP lol`)
        var outOff = newxp; 
        var value = index;
        var result = (value * 100) / outOff;
        let progress = `<:white_left_rounded:960153103548710974><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        const result2 = result.toString()

        // Progress bar
        if (result2 >= 10) progress = `<:blue_left_rounded:960153103812919356><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 20) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 30) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 40) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 50) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 60) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 70) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 80) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white:960153103770976307><:white_right_rounded:960153103691288656>`
        if (result2 >= 90) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:white_right_rounded:960153103691288656>`
        if (result2 >= 100) progress = `<:blue_left_rounded:960153103812919356><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue:960153103942975538><:blue_right_rounded:960153103804563506>`


        const embed = new MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .addField(`**Level**`, `${user.level}`, true)
        .addField(`**Server Rank**`, `N/A`, true)
        .addField(`**Experience**`, `${index} XP`, true)
        .addField(`**Progress (${result.toString().slice(0, 2)}%)**`, `${progress}`)
        .setFooter({ text: `Total Experience: ${user.xp}` })
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send({ embeds: [embed] })
    }
}