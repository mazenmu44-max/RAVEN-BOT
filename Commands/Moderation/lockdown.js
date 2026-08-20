const emojis = require('../../Data/emojis.json')
module.exports = {
    name : 'lockdown',
    description : 'Lockdown a channel',
    aliases : ['lock'],
    parameters : 'channel, reason',
    permissions : ['BAN_MEMBERS'],
    information : `${emojis.warn} Ban Members`,
    usage : 'Syntax: lockdown <channel>\nExample: lockdown #general',
    module : 'moderation',
    pages : [
        {
            name : 'lockdown all',
            description : 'Locks all channels',
            parameters : 'reason',
            information : `${emojis.warn} Ban Members`,
            usage : 'Syntax: lockdown all'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Lockdown
     */

    run : async (client, message, args) => {
        const parameter = args[0]
        if (parameter && command === 'all') {

        } else {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(parameter) || message.guild.channels.cache.find((c) => c.name.includes(parameter)) || message.channel
        }
    },
};