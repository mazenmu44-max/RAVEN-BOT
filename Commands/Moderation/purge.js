const Discord = require('discord.js');
const config = require('../../Data/config.json');
const emojis = require('../../Data/emojis.json');
const prefixData = require('../../Models/prefix');
const errorSchema = require('../../Models/errors');

module.exports = {
  name: 'purge',
  aliases: ['clear', 'prune'],
  module: 'moderation',
  description: 'bulk delete up to 1000 messages',

  run: async (client, message, args) => {
    const prefix = await prefixData.findOne({ guildId: message.guild.id })
    var guildprefix = ''
    if (!prefix) guildprefix = ','
    if (prefix) guildprefix = prefix.prefix

    let sub = args[0];
    let sub2 = args[1];
    let amount = args[0];
    let amount2 = args[2];

    if (sub && sub === 'user') {
      const member = await message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(m => m.user.tag === args.join(" ")) || args[1] || message.member;
      let AllMessages = await message.channel.messages.fetch();
      let FilteredMessages = await AllMessages.filter(x => x.author.id === member.id);
      let deletedMessages = 0

      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `${client.user.username} help`, iconURL: client.user.displayAvatarURL() })
        .setTitle('Command: purge user')
        .setColor(config.color)
        .setDescription(`Purge messages from a member in chat\`\`\`\nSyntax: ${guildprefix}purge user (member) <amount>\nExample: ${guildprefix}purge user ${config.ownertag} 10\`\`\``)
      if (!sub2) return message.channel.send({ embeds: [embed] })
      try {
        const noMember = new Discord.MessageEmbed()
          .setColor(`#faa61b`)
          .setDescription(`${emojis.warn} ${message.author}: I was **unable** to find the **member**: **${args.slice(0).join(" ")}**`)
        if (!sub2 && member) return message.channel.send({ embeds: [noMember] })
        const isNaNEmbed = new Discord.MessageEmbed()
          .setColor('#faa61b')
          .setDescription(`${emojis.warn} ${message.author}: Converting to "int" failed for parameter "search".`)
        if (isNaN(amount2)) return message.channel.send({ embeds: [isNaNEmbed] })
        if (amount2 <= 100) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, true)
        } else if (amount2 <= 200) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          const messagesLeft = amount2 - 100
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 300) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 200
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 400) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 300
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 500) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 400
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 600) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 500
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 700) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 600
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 800) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 700
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 900) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 800
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else if (amount2 <= 1000) {
          FilteredMessages.forEach(msg => {
            if (deletedMessages >= amount2) return
            msg.delete()
            deletedMessages++
          }, 100, true)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          setTimeout(() => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, 100, true)
          }, 2000)
          const messagesLeft = amount2 - 900
          setTimeout(async () => {
            FilteredMessages.forEach(msg => {
              if (deletedMessages >= amount2) return
              msg.delete()
              deletedMessages++
            }, messagesLeft, true)
          }, 2000)
        } else {
          return message.channel.send('you can only purge 1000 messages');
        }
      } catch (error) {
        function token() {
          var tokenText = "";
          var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
          for (var i = 0; i < 60; i++) tokenText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)); return tokenText;
        }
        const errorEmbed = new Discord.MessageEmbed()
          .setDescription(`${emojis.warn} Error occurred while performing command **purge user**. Try again later.`)
          .setColor('#faa61b')
          .setFooter({ text: `${token()}` })
        await message.channel.send({ embeds: [errorEmbed] })
        const newError = new errorSchema({ errorToken: token(), errorText: `${error}`, errorCommand: `purge user`, errorAuthor: `${message.author.tag}`, errorAuthorId: `${message.author.id}`, errorGuild: `${message.guild.name}`, errorGuildId: `${message.guild.id}`, errorChannel: `${message.channel.name}`, errorChannelId: `${message.channel.id}`, })
        newError.save()
      }
    } else if (sub && sub === 'bots') {

    } else if (sub && sub === 'embeds') {

    } else if (sub && sub === 'suckmydick') {
    } else {
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle('Command: purge')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
        .setColor(config.color)
        .setDescription(`Bulk delete large amounts of messages in a text channel`)
        .addField(`**Usage**`, `\`\`\`Syntax: ${guildprefix}purge (subcommand) <args>\nExample: ${guildprefix}purge ${config.ownertag} 10\`\`\``)
        .setColor('#a1b0bd')
      if (!amount) return message.channel.send({ embeds: [embed] })
      try {
        const isNaNEmbed = new Discord.MessageEmbed()
          .setColor('#faa61b')
          .setDescription(`${emojis.warn} ${message.author}: Converting to "int" failed for parameter "search".`)
        if (isNaN(amount)) return message.channel.send({ embeds: [isNaNEmbed] })
        if (amount <= 100) {
          message.channel.bulkDelete(amount, true)
        } else if (amount <= 200) {
          message.channel.bulkDelete(100, true)
          const messagesLeft = amount - 100
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 300) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 200
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 400) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 300
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 500) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 400
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 600) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 500
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 700) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 600
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 800) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 700
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 900) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 800
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else if (amount <= 1000) {
          message.channel.bulkDelete(100, true)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          setTimeout(() => {
            message.channel.bulkDelete(100, true)
          }, 2000)
          const messagesLeft = amount - 900
          setTimeout(async () => {
            message.channel.bulkDelete(messagesLeft, true)
          }, 2000)
        } else {
          return message.channel.send('you can only purge 1000 messages');
        }
      } catch (error) {
        function token() {
          var tokenText = "";
          var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
          for (var i = 0; i < 60; i++) tokenText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)); return tokenText;
        }
        const errorEmbed = new Discord.MessageEmbed()
          .setDescription(`${emojis.warn} Error occurred while performing command **purge**. Try again later.`)
          .setColor('#faa61b')
          .setFooter({ text: `${token()}` })
        await message.channel.send({ embeds: [errorEmbed] })
        const newError = new errorSchema({ errorToken: token(), errorText: `${error}`, errorCommand: `purge`, errorAuthor: `${message.author.tag}`, errorAuthorId: `${message.author.id}`, errorGuild: `${message.guild.name}`, errorGuildId: `${message.guild.id}`, errorChannel: `${message.channel.name}`, errorChannelId: `${message.channel.id}`, })
        newError.save()
      }
    }
  }
}