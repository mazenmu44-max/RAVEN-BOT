const config = require('../../Data/config.json')
module.exports = {
    name : 'restart',
    run : async (client, message, args) => {
        if (message.author.id !== '917210373051011142') return;
        message.channel.send(`Restarting...`).then(async(x) => {
            client.destroy()
            client.login(config.token)
            x.edit(`Restart finished in 0.249s.`)
        })
    }
}