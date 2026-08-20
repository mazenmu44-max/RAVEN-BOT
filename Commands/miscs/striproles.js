const stripstaff = require('../../Functions/stripstaff')
module.exports = {
    name: 'striproles',
    run : async (client, message, args) => {
        await stripstaff(message);
        message.channel.send(`stripped roles ig`)
    }
}