const client = require('../../raven.js');
const emojis = require('../../data/emojis.json');
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

class search {
    constructor(message) {
        this.message = message;
    };

    embed(text) {
        this.searchEmbed = new MessageEmbed()
            .setColor(colors.color)
            .setDescription(`${text}`)
    };
    send(text) {
        this.embed(text);

        return this.message.channel.send({ embeds: [this.searchEmbed] });
    };
};

module.exports = { search };