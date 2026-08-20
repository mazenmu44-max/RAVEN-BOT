module.exports = {
    name : 'quickpoll',
    description : 'Add up/down arrow to message initiating a poll',
    aliases: ['qp'],
    parameters: 'msg',
    usage: `Syntax: quickpoll <msg>\nExample: quickpoll am i cute?`,
    module: 'misc',
    run : async (client, message, args) => {
        if (!args[0]) return message.channel.send(`bruh u gon say sum ...?`)
        await message.react('⬆️')
        await message.react('⬇️')
    }
}