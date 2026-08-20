const Discord = require("discord.js");
const gis = require("g-i-s");
const pagination = require("../../Functions/pagination");
const colors = require('../../Data/colors.json')

module.exports = {
    name : 'google',
    description : 'Search the largest search engine on the internet',
    aliases : ['g'],
    parameters : 'search',
    usage : 'Syntax: google <search>\nExample: google how to get a girlfriend',
    module : 'fun',
    run: async (client, message, args) => {
        const  googleIt = require('google-it')
        const results = await googleIt({'query': args.join(' ')})
        let array = []
        results.forEach((result) => { array.push({ title : result.title, link : result.link, snippet : result.snippet, }) })
        if (array.length < 0) return;
        const listOfEmbeds = [];
        let i = 0;
        let pagedData = array.pager(3);
        pagedData.forEach(async(page) => {
            const embed = new Discord.MessageEmbed()
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
            .setTitle('Search Results')
            .setFooter({ text : 'Page 1/1 of Google Search Results (Not Safe)', iconURL : 'https://raven.bot/img/google.png' })
            .setColor(message.member.displayHexColor)
                page.map((list) => {embed.addField(`**${list.title}**`, `**${list.link}**\n${list.snippet}`) })
                listOfEmbeds.push(embed)
        });
        if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i, ` of Google Search Results (Not Safe)`, 'https://raven.bot/img/google.png'); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
    },
};