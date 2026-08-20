const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
module.exports = {
    name : 'permissions',
    description : 'Check permissions for member or myself',
    aliases : ['perms'],
    parameters : 'member, channel',
   // permissions : ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
    information : `${emojis.warn} Manage Roles & Channels`,
    usage : 'Syntax: permissions <member or channel>\nExample: permissions #general',
    module : 'admin',
    run : async (client, message, args, prefix) => {
        let denied = []
        const permissions = [
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'STREAM',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_GUILD_INSIGHTS',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS_AND_STICKERS',
            'USE_APPLICATION_COMMANDS',
            'REQUEST_TO_SPEAK',
            'MANAGE_EVENTS',
            'MANAGE_THREADS',
            'USE_PUBLIC_THREADS',
            'CREATE_PUBLIC_THREADS',
            'USE_PRIVATE_THREADS',
            'CREATE_PRIVATE_THREADS',
            'USE_EXTERNAL_STICKERS',
            'SEND_MESSAGES_IN_THREADS',
            'START_EMBEDDED_ACTIVITIES',
            'MODERATE_MEMBERS'
          ]
          permissions.forEach(async(permission) => {
              if (!message.member.permissions.toArray().includes(permission)) {
                  denied.push(`${permission}`)
              }
          })
          const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
          let string = `${denied.join('\n')}`
          string = string.toLowerCase()
          string = string.replaceAll('_', ' ')
          let deniedPermissions = uppercaseWords(string)
          let allowed = `${message.member.permissions.toArray().join('\n')}`
          allowed = allowed.toLowerCase()
          allowed = allowed.replaceAll('_', ' ')
          let allowedPermissions = uppercaseWords(allowed)
          const embed = new MessageEmbed()
          .addField(`**Allowed**`, `${allowedPermissions}`, true)
          .addField(`**Denied**`, `${deniedPermissions || 'N/A'}`, true)
          .setColor(message.member.displayHexColor)
          message.channel.send({ embeds : [embed] })
    },
};