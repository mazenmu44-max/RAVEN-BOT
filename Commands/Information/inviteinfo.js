const Discord = require('discord.js');
const config = require('../../Data/config.json');
const emojis = require('../../Data/emojis.json');
const moment = require('moment');

module.exports = {
  name: 'inviteinfo',
  aliases: [],
  description: 'View basic invite code information',
  module: 'information',
  timeout: 2000,
  parameters: 'code',
  information: ``,
  usage: 'Syntax: inviteinfo <code>\nExample: inviteinfo juri',

  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: `${client.user.username} help`,
        iconURL: client.user.displayAvatarURL()
      })
      .setColor(config.color)
      .setTitle('Command: inviteinfo')
      .setDescription(`View basic invite code information\`\`\`Syntax: inviteinfo <code>\nExample: inviteinfo ${client.user.username}\`\`\``)
    if (!args[0]) return message.channel.send({
      embeds: [embed]
    })

    try {
      let inviteCode = args[0] ? args[0] : await args[0]
      await client.fetchInvite(inviteCode).then(invite => {

        if (invite.createdAt != null) timestamp = invite.createdAt;

        let partnered = invite.partnered
        if (invite.partnered) {
          partnered = `∙ `;

        } else {
          partnered = ''
        }

        const channelTypes = {
          DM: 'dm',
          GUILD_GROUP: 'group dm',
          GUILD_TEXT: 'text',
          GUILD_VOICE: 'voice',
          GUILD_CATEGORY: 'category',
          UNKNOWN: 'unknown',
          GUILD_NEWS: 'news',
        }

        const verificationLevels = {
          NONE: 'None',
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High',
          VERY_HIGH: 'Highest'
        };

        let banner = invite.guild.bannerURL({
          dynamic: true,
          format: "png",
          size: 2048
        })
        if (banner) {
          banner = `[**Banner Image**](${invite.guild.bannerURL({ dynamic: true, format: "png", size: 2048 })}), `
        } else {
          banner = '**Banner Image**'
        }

        let splash = invite.guild.splashURL({
          dynamic: true,
          format: "png",
          size: 2048
        })
        if (splash) {
          splash = `[**Splash Image**](${invite.guild.splashURL({ dynamic: true, format: "png", size: 2048 })})`
        } else {
          splash = '**Splash Image**'
        }

        let icon = invite.guild.iconURL({
          dynamic: true,
          format: "png",
          size: 2048
        })
        if (icon) {
          icon = `[**Icon Image**](${invite.guild.iconURL({ dynamic: true, format: "png", size: 2048 })}), `
        } else {
          icon = '**icon image**'
        }

        let rulesChannelCreated = invite.rulesChannel
        if (rulesChannelCreated) {
          rulesChannelCreated = `${moment(invite.createdAt).format("dddd, MMMM Do YYYY, h:mm A")}`
        } else {
          rulesChannelCreated = 'N/A'
        }

        let rulesChannelid = invite.rulesChannel
        if (rulesChannelid) {
          rulesChannelid = `\`${invite.rulesChannel.id}\``
        } else {
          rulesChannelid = 'N/A'
        }

        const done = new Discord.MessageEmbed()
          .setThumbnail(invite.guild.iconURL({
            dynamic: true
          }))
          .setAuthor({
            name: message.member.displayName,
            iconURL: message.author.avatarURL({
              dynamic: true
            })
          })
          .setTitle(`Invite Code: ${invite.code} ${message.guild.verified ? `${flags2}` : ``}`)
          .addFields({
            name: `**Channel & Invite**`,
            value: "\n" + `**Name:** ${invite.channel.name} (\`${channelTypes[invite.channel.type]}\`)\n**ID:** \`${invite.channel.id}\`\n**Creation:** ${moment(invite.channel.createdAt).format("dddd, MMMM Do YYYY, h:mm A")}\n**Invite Expiration:** Never\n**Inviter:** Unknown\n**Temporary:** N/A\n**Usage:** N/A` + "",
            inline: true
          }, )
          .addFields({
            name: `**Guild**`,
            value: "\n" + `**Name:** ${invite.guild.name}\n**ID:** \`${invite.guild.id}\`\n**Creation:** ${moment(invite.guild.createdAt).format("dddd, MMMM Do YYYY, h:mm A")}\n**Members:** ${invite.memberCount.toLocaleString()}\n**Members Online:** ${invite.presenceCount.toLocaleString()}\n**Verification Level:** ${verificationLevels[invite.guild.verificationLevel]}` + "",
            inline: true
          }, )
          .addField(`**Design**`, `${icon} ${banner} ${splash}`)
          .setColor(user.displayHexColor || config.color)
        return message.channel.send({
          embeds: [done]
        })
      })
    } catch (e) {
      const noGuild = new Discord.MessageEmbed()
        .setColor('#faa61b')
        .setDescription(`${emojis.warn} ${message.author}: Invalid **invite code** given`)
      return message.channel.send({
        embeds: [noGuild]
      })
    }
  }
}