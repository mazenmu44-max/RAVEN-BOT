const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const axios = require('axios')
module.exports = {
    name : 'banner',
    run : async (client, message, args) => {
        const member = args[0] ? await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((member) => member.user.displayName.includes(args.join(' ')) || member.user.username.includes(args.join(' ') || member.user.tag.includes(args.join(' ')))) || args[0] : message.member
        const user = await client.users.fetch(client.users.resolveId(member)).catch(() => null);
        if (!user) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find that **member** or the **ID** is invalid`).setColor(colors.warn)] })
        const result = await axios.get(`https://discord.com/api/users/${user.id}`, { headers: { Authorization: `Bot ${config.token}` }, })
        const { banner } = result.data;
        if (banner) {
            const extension = banner.startsWith("a_") ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=2048`;
        const embed = new MessageEmbed()
        .setTitle(`${user.username}'s banner`)
        .setImage(url)
        .setColor(message.member.displayHexColor)
        .setURL(url)
        member === message.member ? null : embed.setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
        message.channel.send({embeds:[embed]})
        } else {
            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${member === message.member ? 'You dont have a **banner** set!' : `${user} doesnt have a **banner** set!`}`).setColor(colors.warn)] })
        }
    }
}