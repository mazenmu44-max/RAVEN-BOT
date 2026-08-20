module.exports = {
    name: 'previousreact',
    run : async (client, message, args, Discord) => {
        const msgs = await message.channel.messages.fetch({ limit: 2 })
        msgs.forEach((msg) => {
            if (msg.content === message.content) return;
            msg.react('🅿️')
        })
    }
}