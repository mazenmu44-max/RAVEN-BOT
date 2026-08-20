const { MessageEmbed } = require('discord.js')
const pagination = require('../../Functions/pagination')
module.exports = {
    name : 'mutuals',
    run : async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || client.users.cache.get(args[0]) || message.member
        const embeds = []; var number = 0; const array = []; await client.guilds.cache.filter(guild => guild.members.cache.get(member.user.id)).map((guild) => { array.push(`\`${++number}\` [**${guild.name}**](https://discord.com/channels/${guild.id}/${guild.rulesChannelId || 'N/A'}) (${guild.id})`) })
        const pager = array.pager(10); pager.forEach(async (page) => {
            const list = page.map((x) => { return x }).join('\n'); const embed = new MessageEmbed().setDescription(`${list}`); embeds.push(embed)
        }); if (embeds.length > 1) { await pagination(message, embeds, number, number) } else { message.channel.send({ embeds : [embeds[0]] }) }
    }
}