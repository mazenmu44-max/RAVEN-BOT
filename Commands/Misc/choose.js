const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
module.exports = {
    name : 'choose',
    run : async (client, message, args, prefix) => {
        if (!args.join(' ')) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: choose').setDescription(`Give me choices and I will pick for you\`\`\`Syntax: ${prefix}choose <choices>\nExample: ${prefix}choose yes, no\`\`\``).setColor('#718090')] })
        let [option1, ...option2] = args.join(' ').split(",");
        option1 = option1.trim()
        if (option2.length === 0 || args.join(' ').endsWith(',')) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Not enough choices to pick from`).setColor(colors.warn)] })
        let choices = [option1, option2.toString().trim()]
        const random = Math.floor(Math.random() * choices.length);
        message.channel.send({ embeds : [new MessageEmbed().setDescription(`:thinking: ${message.author}: I choose \`${choices[random]}\``).setColor('#7189c6')] })
    },
};