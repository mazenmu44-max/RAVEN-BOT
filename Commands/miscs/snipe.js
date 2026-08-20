const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'snipdde',
    aliases: ['dds'],
    run : async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.channel
        if (channel.type === 'GUILD_VOICE') return;
        const msg = client.snipes.get(channel.id)
        if (!msg) return;
        const embed = new MessageEmbed()
        .setAuthor({ name: `${msg.author.username}`, iconURL: msg.author.displayAvatarURL({ dynamic: true })})
        .setDescription(msg.content)
        .setColor(message.member.displayHexColor)
        .setTimestamp(msg.createdTimestamp)
        .setFooter({ text: `Sniped message by ${message.author.tag}`})
        if (msg.image && msg.image.endsWith('.mp4')) embed.addField(`**Attachments**`, `[video.mp4](${msg.image})`)
        if (msg.image) embed.setImage(msg.image)
        message.channel.send({ embeds: [embed] })
    }
}