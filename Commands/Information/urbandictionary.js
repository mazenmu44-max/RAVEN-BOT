const {
    MessageEmbed
} = require('discord.js')
const querystring = require('querystring')
const fetch = require('node-fetch')
const colors = require('../../Data/colors.json')
const pagination = require('../../Functions/pagination');

module.exports = {
    name : 'urbandictionary',
    description : 'Gets the definition of a word/slang from Urbandictionary',
    aliases : ['define', 'ud', 'urban'],
    parameters : 'search',
    usage : 'Syntax: urbandictionary <word>\nExample: urbandictionary Slatt',
    module : 'information',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Urbandictionary
     */


    run : async (client, message, args, Discord) => {
        if (!args.length) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name : `${client.user.username} help`, iconURL : client.user.displayAvatarURL({ dynamic : true }) }).setTitle('Command: urbandictionary').setDescription('Gets the definition of a word/slang from Urbandictionary```Syntax: urbandictionary <word>\nExample: urbandictionary Slatt```').setColor(colors.help)] })

        const search = querystring.stringify({
            term: args.join(' ')
        })

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${search}`).then(response => response.json())

        if (!list.length) return message.channel.send({ embeds : [new MessageEmbed({ description : `:mag_right: ${message.author}: No results were found for **${args.slice(0).join(' ')}**`, color : `#7189da`})] });

        let embeds = []
        list.forEach(async (result) => {
            const page = new MessageEmbed()
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
            .setTitle(`${result.word}`)
            .setURL(`${result.permalink}`)
            .setDescription(`${result.definition}`)
            .addField('**Example**', `${result.example}`, false)
            .addField('**Votes**', `:thumbsup: \`${result.thumbs_up} / ${result.thumbs_down}\` :thumbsdown:`, false)
            .setColor(message.member.displayHexColor)
            .setFooter({ text : `Page 1/1 of Urban Dictionary Results`, iconURL : 'https://cdn.notsobot.com/brands/urban-dictionary.png' })
            if (embeds.length < 10) embeds.push(page)
        });
        if (embeds.length > 1) { await pagination(message, embeds, embeds.length, embeds.length, ' of Urban Dictionary Results', 'https://cdn.notsobot.com/brands/urban-dictionary.png'); } else { return message.channel.send({ embeds: [embeds[0]] }); }
    },
};