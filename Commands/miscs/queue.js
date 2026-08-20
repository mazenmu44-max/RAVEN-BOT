const player = require("../../Functions/player");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "queadadadadadaufdadade",
    description: "display the song queue",
    run: async (client, message, args) => {
        const queue = player.getQueue(message.guild);
        if (!queue?.playing) return
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 5).map((m, i) => { return `\`${i + 1}\` [${m.title}](${m.url})\n*requested by ${m.requestedBy.tag}*`; });
        const queueEmbed = new MessageEmbed()
        .setAuthor({ name: `${message.member.displayName}` })
        .setColor(`#a1b0bd`)
        //.setColor(message.member.displayHexColor)
        .setTitle(`currently queued tracks in **${message.guild.name}**`)
        .addField(`**currently playing**`, `[${currentTrack.title}](${currentTrack.url})`)
        .setFooter({ text: `total queued tracks: ${queue.tracks.length}`})
        //.setTimestamp()
        if (tracks.join("\n")) queueEmbed.addField(`**queue**`, `${tracks.join("\n")}${ queue.tracks.length > tracks.length ? `\n...${ queue.tracks.length - tracks.length === 1 ? `${ queue.tracks.length - tracks.length } more track` : `${ queue.tracks.length - tracks.length } more tracks` }` : ""}`)
        message.channel.send({embeds: [queueEmbed]})
    },
};