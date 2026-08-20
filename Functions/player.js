const Player = require("discord-player");
const client = require("../bleed.js");
const { MessageEmbed } = require('discord.js')

const player = new Player.Player(client, {
    leaveOnEnd: false,
    leaveOnStop: true,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 1000,
    autoSelfDeaf: true,
    ytdlOptions: { quality: 'highestaudio', highWaterMark: 1 << 25 },
    initialVolume: 100,
    bufferingTimeout: 0,
    spotifyBridge: true,
    disableVolume: false
  });
player.on("trackStart", (queue, track) => queue.metadata.channel.send({ embeds : [new MessageEmbed().setDescription(`:notes: Now playing [**${track.title}**](${track.url}) in ${queue.metadata.voice} [${track.requestedBy}]`).setColor('#69919d')] }))
player.on('botDisconnect', (queue) => {
    queue.destroy()
})
player.on('queueEnd', (queue) => {
    setTimeout(() => {
        if (!queue.tracks[0]) {
            //queue.metadata.guild.members.cache.get(client.user.id).voice.setChannel(null)
            //queue.metadata.channel.send({ embeds : [new MessageEmbed().setDescription(`Left ${queue.metadata.voice} due to **3 minutes** of inactivity`).setColor('#69919d')] })
            //queue.destroy()
        } else {
            return;
        }
    }, 180000)
})

module.exports = player;
