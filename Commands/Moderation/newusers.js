const { MessageEmbed } = require('discord.js')
const ms = require('ms')
const time = ms('24h')

module.exports = {
  name : 'newusers',
  module : 'Moderation',
  description : 'View all recently joined members in the past 24 hours',
  aliases : ['newmembers'],
  information : `Module: **Moderation**\nNote: **Maximum 100 Results**`,
  arguments : { notRequired : ['amount'] },
  usage : { syntax : 'newusers (amount)' },

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Newusers
     */

    run : async (client, message, args, prefix) => {
      let data = []
        await message.guild.members.cache.sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).forEach(async(member) => {
            if (Date.now() - new Date(member.joinedAt).getTime() < time) {
                data.push({ user : member.user.id, timestamp : member.joinedTimestamp })
            }
        })
          const listOfEmbeds = [];
          let pagedData = data.pager(15);
          let i = 0
      
          pagedData.forEach((page) => {
            let gs = page
              .map((user) => {
                  return `\`${++i}\` **${client.users.cache.get(user.user) ? `${client.users.cache.get(user.user).tag}` : 'Unknown User'}** joined <t:${Math.floor(user.timestamp / 1000)}:R>`
              }).join("\n");
      
            const embed = new MessageEmbed()
              .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setTitle('New users today')
              .setColor(message.member.displayHexColor)
              .setDescription(gs)
              .setFooter({ text : `Page 1/1 (${i} ${i === 1 ? 'entry' : 'entries' })` })
            listOfEmbeds.push(embed);
          });
          const pagination = require('../../Functions/pagination')
          if (listOfEmbeds.length > 1) {
            await pagination(message, listOfEmbeds, pagedData.length, i);
          } else {
            return message.channel.send({ embeds: [listOfEmbeds[0]] });
          }
    },
};