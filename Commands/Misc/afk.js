const { afk } = require('../../Collection')
const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
module.exports = {
  name : 'afk',
  description : 'Set an AFK status for when you are mentioned',
  parameters : 'status',
  usage : 'Syntax: afk <status>\nExample: afk sleeping...(slart)',
  module : 'misc',
  run: async (client, message, args, prefix) => {
    const status = args.join(' ') || 'AFK'
    afk.set(message.author.id, [Date.now(), status, message.createdTimestamp])
    message.channel.send({ embeds : [new MessageEmbed().setDescription(`You've been set as **away** with the status: **${status}**`).setColor(colors.color)] })
  }
}