/*STRIPSTAFF*/

const { MessageActionRow } = require("discord.js");
const { MessageButton } = require('discord.js')

/**
 *
 * @returns Raid
 */

 const raid = async (message, guild, duration, punishment) => {
    try {
        const ageLimit = duration
        var membersArray = []
        await guild.members.cache.forEach((member) => {
            const age = new Date(member.user.createdAt).getTime();
            const date = Date.now() - age;
            if (date < ageLimit) {
                membersArray.push({ memberId: `${member.user.id}` })
            }
        })
        const membersSize = membersArray.length
        if (membersSize < 1) return message.channel.send('theres litterally no members that joined in that time span lol')
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setEmoji('<:approve_action_emote:938411192756621312>')
            .setCustomId('approve_raid')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setEmoji('<:cancel_action_emote:938411192832131082>')
            .setCustomId('decline_raid')
            .setStyle('DANGER')
        )
        const msg = await message.channel.send({ content: `are u sure u want to ban ${membersSize} members G?`, components: [row] })
        const filter = async (i) => {
            await i.deferUpdate();
            if (i.user.id != message.author.id) {
              await message.channel.send(`${i.user} dawg U litterally cant interact with this button what are u doing`);
            }   
            return i.user.id == message.author.id;
          };
          const collector = msg.createMessageComponentCollector({
            filter,
            time: 100000,
          });
          let endStatus = true
          collector.on("collect", async (interaction) => {
            if (interaction.user.id != message.author.id) return;
            if (interaction.customId === 'approve_raid') {
                endStatus = false
                collector.stop()
            } else if (interaction.customId === 'decline_raid') {
                collector.stop()
            }
          })
          collector.on("end", async () => {
              if (endStatus === true) {
                  return msg.edit({ content: 'stopped the raid function...', components: [] })
              } else if (endStatus === false) {
                  msg.edit({ content: `banned **${membersSize}** members who joined in the timespan you provided`, components: [] })
                  membersArray.forEach((array) => {
                      if (punishment === 'ban') message.guild.members.ban(array.memberId)
                      if (punishment === 'kick') message.guild.members.kick(array.memberId)
                  })
              }
          })
    } catch (error) {
        return console.log(error)
    }
}
module.exports = raid;