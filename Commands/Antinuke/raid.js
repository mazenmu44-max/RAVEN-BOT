const ms = require('ms')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name: 'raid',
    description : 'Remove all members that joined in the time provided in the event of a raid',
    parameter : 'time, action, reason',
    permissions : ['BAN_MEMBERS'],
    information : `${emojis.warn} Ban Member`,
    usage : 'Syntax: raid (time) (kick or ban) <reason>\nExample: raid 5m ban Suspected raid',
    module : 'moderation',
    run : async (client, message, args) => {
        const time = args[0]
        const action = args[1]
        const actions = ['ban', 'kick']
        if (!time || !action || !actions.includes(action)) return message.channel.send('help placeholder here')
        const milliseconds = ms(time)
        if (!milliseconds) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Invalid **time passed** - make sure you format like this: \`5m\` or \`30s\``).setColor(colors.warn)] })
        if (milliseconds > 1800000) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: The furthest you can go back is **30 minutes**`).setColor(colors.warn)]})
        try {
            var list = []
            await message.guild.members.cache.forEach((member) => { if (Date.now() - new Date(member.joinedAt).getTime() < milliseconds) list.push({ memberId: `${member.user.id}` })})
            if (list.length < 1) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Found **no members** to punish!`).setColor(colors.warn)] })
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setLabel('Approve')
                .setCustomId('approve')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setLabel('Decline')
                .setCustomId('decline')
                .setStyle('DANGER')
            )
            const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Are you sure that you want to ${action} **${list.length} ${list.length > 1 ? 'members' : 'member'}**?`).setColor(colors.warn)], components: [row] })
            const filter = async (i) => {
                await i.deferUpdate();
                if (i.user.id != message.author.id) {
                  return;
                }   
                return i.user.id == message.author.id;
              };
              const collector = msg.createMessageComponentCollector({
                filter,
                time: 100000,
              });
              collector.on("collect", async (interaction) => {
                if (interaction.user.id != message.author.id) return;
                if (interaction.customId === 'approve') {
                    list.forEach((l)=>{
                        if (action === 'ban') {
                            message.guild.members.ban(l.memberId)
                        } else {
                            message.guild.members.kick(l.memberId)
                        }
                    })
                    msg.delete()
                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: ${action === 'ban' ? 'Banned' : 'Kicked'} **${list.length}** ${list.length > 1 ? 'users' : 'user'}.`).setColor(colors.approve)] })
                    collector.stop()
                } else if (interaction.customId === 'decline') {
                    message.delete()
                    msg.delete()
                    collector.stop()
                }
              })
        } catch (error) {
            return console.log(error)
        }
    }
}