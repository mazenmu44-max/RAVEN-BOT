const client = require('../../raven.js');
const emojis = require('../../data/emojis.json');
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

class help {
    constructor(message, prefix, client) {
        this.message = message;
        this.prefix = prefix;
        this.client = client
    };

    embed(command) {
        this.helpEmbed = new MessageEmbed()
        .setAuthor({ name : `${this.client.user.username}`, iconURL : this.client.user.displayAvatarURL({ dynamic : true }) })
        .setColor(colors.color)
        .setTitle(`${this.prefix}${command.name} ${command.usage ? command.usage.syntax : ''}`)
        .setDescription(`${command.description}`)
        command.usage ? command.usage.example ? this.helpEmbed.addField('Example', `\`\`\`${this.prefix}${command.usage.example}\`\`\``) : null : null
    };
    send(command) {
        this.embed(command);

        return this.message.channel.send({ embeds: [this.helpEmbed] });
    };
};

module.exports = { help };