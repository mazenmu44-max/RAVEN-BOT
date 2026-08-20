const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js') 

module.exports = {
    name : 'bc',
    permissions : ['MANAGE_MESSGAES'],
    module : 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Bc
     */

    run : async (client, message, args) => {
        message.delete()
        message.channel.messages.fetch().then(messages => {
            const c = messages.filter(msg => msg.author.bot);
            message.channel.bulkDelete(c);
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed \`${c.size}\` messages from **bots**`).setColor(colors.approve)] }).then((x) => {
                setTimeout(() => {
                    x.delete()
                }, 3000)
            })
        })
    },
};