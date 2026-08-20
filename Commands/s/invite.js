const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'rfaf',
    aliases: ['inafafafv'],
    run : async (client, message, args) => {
        const invite = new MessageEmbed()
        .setDescription(`${message.author}: **${client.user.tag}** costs $1,000,000/server unless it used to be in your server.. contact: archive#5425, or [join the support server](https://discord.gg/TWsfq9XRKp) :thumbsup:`)
        .setColor('#a1b0bd')
        message.channel.send({ embeds: [invite] })
    }
}