const config = require('../../Data/config.json')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')

const { MessageEmbed } = require('discord.js')

module.exports = { 
    name : 'ban',
    aliases : ['b', 'hackban'],
    description : 'Ban a user from the guild, add a reason & delete their messages if they have any',
    permissions : ['BAN_MEMBERS'],
    arguments : { required : ['user'], notRequired : ['delete_history', 'reason'] },
    information : `Module: **Moderation**\nPermissions: **Ban Members**`,
    module : 'Moderation',
    usage : { syntax : 'ban (user) (delete history) <reason>', examples : [`hackban ${config.ownerid} leaking my dick pics`, `ban ${config.ownertag} goofy ass bot dev`] },

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Ban
     */

    run : async (client, message, args, prefix) => {
      if (!args[0]) return await new client.help(message, prefix, client).send(client.commands.get('ban'))

      const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.guild.members.cache.find((m) => m.user.username.toLowerCase().includes(args[0].toLowerCase()) || m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()))
      if (!member) return await new client.warning(message).send(`I was unable to find a member with the name: **${args[0]}**`)

      const delete_days = isNaN(args[1]) ? 0 : args[1] 
      const reason = args.slice(delete_days === 0 ? 1 : 2).join(' ') || 'No reason provided'

      message.guild.members.ban(member.user.id, {
        days : delete_days > 7 ? 7 : delete_days,
        reason : `User Responsible: ${message.author.tag} / ` + reason
      })
    },
};