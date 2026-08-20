const { MessageEmbed } = require('discord.js'), colors = require('../../Data/colors.json')
module.exports = {
  name: "ping",
  dontDisplay: true,
  aliases: ["latency", "ms"],

  run: async (client, message, args) => {
  
    let ping = [`idk dude, leave suggestions for this shit`]
      let number = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
    const random = Math.floor(Math.random() * ping.length);
    const randomnumber = Math.floor(Math.random() * number.length)
    let msg = await message.channel.send({embeds:[new MessageEmbed().setDescription(`Websocket: **${client.ws.ping}**`).setColor(colors.color).setFooter({ text : `Gateway: ${client.ws.ping}ms, LastFM: ${client.ws.ping}ms` })]})

    const timeDiff = (msg.editedAt || msg.createdAt) - (message.editedAt || message.createdAt);

    await msg.edit({ embeds : [new MessageEmbed().setDescription(`Websocket: **${client.ws.ping}ms** (edit: **${timeDiff - client.ws.ping}.${randomnumber}ms**)`).setColor(colors.color).setFooter({ text : `Gateway: ${client.ws.ping}ms, LastFM: ${client.ws.ping}ms` })] })
  }
}