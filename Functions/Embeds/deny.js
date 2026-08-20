const client = require('../../raven.js');
const emojis = require('../../data/emojis.json');
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

class deny {
    constructor(message) {
        this.message = message;
    };

    embed(text) {
        this.denyEmbed = new MessageEmbed()
            .setColor(colors.deny)
            .setDescription(`${text}`)
    };
    send(text) {
        this.embed(text);

        return this.message.channel.send({ embeds: [this.denyEmbed] });
    };
};

module.exports = { deny };