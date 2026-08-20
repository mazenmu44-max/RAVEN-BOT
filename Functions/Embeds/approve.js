const client = require('../../raven.js');
const emojis = require('../../data/emojis.json');
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

class approve {
    constructor(message) {
        this.message = message;
    };

    embed(text) {
        this.approveEmbed = new MessageEmbed()
            .setColor(colors.approve)
            .setDescription(`${text}`)
    };
    send(text) {
        this.embed(text);

        return this.message.channel.send({ embeds: [this.approveEmbed] });
    };
};

module.exports = { approve };