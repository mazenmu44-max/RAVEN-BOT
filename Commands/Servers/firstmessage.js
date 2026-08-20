const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'firstmessage',
    description : 'Get a link for the first message in a channel',
    aliases : ['firstmsg'],
    parameters : 'channel',
    usage : 'Syntax: firstmessage (channel)',
    module : 'servers',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Firstmessage
     */

    run: async (client, message, args) => {
        const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1,
        });
        const msg = fetchMessages.first();

        const embed = new MessageEmbed()

            .setDescription(`Click [here](${msg.url}) to jump to the **first message**!`)
            .setColor('#6e8ad3')
        message.channel.send({
            embeds: [embed]
        });
    },
};