module.exports = {
    name : 'disconnect',
    aliases : ['dc'],
    run : async (client, message, args) => {
        const player = require("../../Functions/player");
        
        if (!queue?.playing) return;
        const member = message.guild.members.cache.get(client.user.id)
        member.voice.setChannel(null); message.react('👋')
        queue.destroy();
    }
}