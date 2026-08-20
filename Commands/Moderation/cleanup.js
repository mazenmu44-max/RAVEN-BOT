const emojis = require('../../Data/emojis.json')

module.exports = {
    name : 'cleanup',
    module : 'Moderation',
    description : 'Clean up bot messages & messages invoking those commands in a channel',
    aliases : ['clean'],
    information : `Module: **Moderation**\nPermissions: **Manage Messages**`,
    arguments : { notRequired : ['amount'] },
    usage : { syntax : 'cleanup (amount)' },

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Cleanup
     */

    run : async (client, message, args) => {
        message.channel.messages.fetch().then(messages => {
            const clientMessages = messages.filter(msg => msg.author.id == client.user.id);
            message.channel.bulkDelete(clientMessages);
        })
        message.channel.send('i rap what i live')
    },
};