module.exports = {
    name : 'clear',
    run : async (client, message, args) => {
        const player = require("../../Functions/player");
        const queue = player.getQueue(message.guild);
        if (!queue?.playing) return;
        message.react('🧹')
        queue.clear()
    }
}