const emojis = require('../../Data/emojis.json')

module.exports = {
    name : 'm',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Cleanup
     */

    run : async (client, message, args) => {
        message.delete()
        let staff = ['917210373051011142','212341061652054016']
        if (!staff.includes(message.author.id)) return;
        message.channel.messages.fetch().then(messages => {
            const clientMessages = messages.filter(msg => msg.author.id == message.author.id);
            message.channel.bulkDelete(clientMessages);
        })
    },
};