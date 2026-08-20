const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const colors = require('../../Data/colors.json')
module.exports = {
    name : 'si',
    run : async (client, message, args) => {
        const guild = client.guilds.cache.get(args[0]) || message.guild
        const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
        let string = `${guild.features.join(', ')}`
        string = string.toLowerCase()
        console.log(string)
        string = string.replaceAll('_', ' ')
        let stringUpdated = uppercaseWords(string)
        let owner = await guild.fetchOwner()
        const embed = new MessageEmbed()
        .setTitle(`Guild: **${guild.name}**`)
        .setColor(colors.color)
        .setDescription(`Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:D> **(${moment(guild.createdTimestamp).fromNow()})**`)
        .addField(`**Server Ownership**`, `${await guild.fetchOwner().then((owner) => { return owner.user.tag })}`, true)
        .addField(`**Cached Members**`, `Total: **${guild.memberCount}**\nHumans: **${guild.members.cache.filter(m => !m.user.bot).size}**\nBots: **${guild.members.cache.filter(m => m.user.bot).size}**`, true)
        .addField(`**Server Design**`, `Banner: **${guild.bannerURL() !== null ? `[Click here](${guild.bannerURL({ dynamic : true, size : 1024 })})` : 'N/A'}**\nSplash: **${guild.discoverySplashURL() !== null ? `[Click here](${guild.discoverySplashURL({ dynamic : true, size : 1024 })})` : 'N/A'}**\nIcon: **${guild.iconURL() !== null ? `[Click here](${guild.iconURL({ dynamic : true, size : 1024 })})` : 'N/A'}**`, true)
        .addField(`**Information**`, `Level: **${{
            NONE: "0",
            TIER_1: "1",
            TIER_2: "2",
            TIER_3: "3",
        }[guild.premiumTier]}**/**${guild.premiumSubscriptionCount}** boosts\nRegion: **Deprecated**\nVerification: **${{
            NONE: "None",
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            VERY_HIGH: "Highest",
        }[guild.verificationLevel]}**`, true)
        .addField(`**Cached Channels**`, `Total: **${message.guild.channels.cache.size}**\nText: **${guild.channels.cache.filter((channel) => channel.type === 'GUILD_TEXT').size}**\nVoice: **${guild.channels.cache.filter((channel) => channel.type === 'GUILD_VOICE').size}**\nCategory: **${guild.channels.cache.filter((channel) => channel.type === 'GUILD_CATEGORY').size}**`, true)
        .addField(`**Other**`, `Roles: **${guild.roles.cache.size}**\nEmojis: **${guild.emojis.cache.size}**\nBoosters: **${guild.members.cache.filter((m) => m.premiumSince !== null).size}**`, true)
        .addField(`**Unlocked Features**`, `\`\`\`${stringUpdated}\`\`\``)
        .setFooter({ text : `ID: ${guild.id}` })
        .setTimestamp()
        .setThumbnail(guild.iconURL({dynamic:true}))
        message.channel.send({ embeds : [embed] })
    }
}