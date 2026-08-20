const client = require('../../raven.js');
const emojis = require('../../data/emojis.json');
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

class warning {
    constructor(message) {
        this.message = message;
    };

    embed(text) {
        this.warningEmbed = new MessageEmbed()
            .setColor(colors.warn)
            .setDescription(`${text}`)
    };
    send(text) {
        this.embed(text);

        return this.message.channel.send({ embeds: [this.warningEmbed] });
    };
};

module.exports = { warning };