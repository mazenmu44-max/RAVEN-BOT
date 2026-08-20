const {
    MessageEmbed
} = require("discord.js")
const {
    approve,
    warn
} = require('../../Data/emojis.json')
module.exports = {
    name: 'embedcsssode',
    aliases: ['src'],
    userperms: 'MANAGE_MESSAGES',
    module: 'misc',
    syntax: 'Syntax: embedcode (message id)\nExample: embedcode 923202483399065672',
    parameters: 'messageid',
    information: `${warn} Manage Messages`,
    description: 'Copy an existing embeds code for creating an embed',
    run: async (client, message, args) => {
        const link = args[0]
        const noargEmbed = new MessageEmbed()
            .setDescription(`${warn} ${message.author}: Missing **message link** to copy embed code`)
            .setColor(`#ffa602`)
        if (!link) return message.channel.send({
            embeds: [noargEmbed]
        })
        try {
            const embed = message.channel.message.fetch(link)

                        const errorEmbed = new MessageEmbed()
                        .setDescription(`${warn} ${message.author}: Invalid **message link** was provided`)
                        .setColor(`#ffa602`)
                    if (!embed) return message.channel.send({
                        embeds: [errorEmbed]
                    })
                    const noEmbed = new MessageEmbed()
                        .setDescription(`${warn} ${message.author}: [${args[0]}](${link}) does not contain any **embeds**`)
                        .setColor(`#ffa602`)
                    if (!embed.embeds || !embed.embeds.length) return message.channel.send({
                        embeds: [noEmbed]
                    })
        
                    const json = toBleed(embed.content, embed.embeds[0])
        
                    const copyembed = new MessageEmbed()
                        .setDescription(`${approve} ${message.author}: **Successfully copied the embed code**\n\`\`\`json\n${json}\`\`\``)
                        .setColor(`#a3eb7b`)
        
                    message.channel.send({
                        embeds: [copyembed]
                    })

        } catch (error) {
            console.log
            const errorEmbed2 = new MessageEmbed()
                .setDescription(`${warn} ${message.author}: Invalid **message id** was provided`)
                .setColor(`#ffa602`)
            if (error.code === 404) {
                message.channel.send({
                    embeds: [errorEmbed2]
                })
            } else {
                return message.channel.send({
                    embeds: [errorEmbed2]
                })
            }
        }

        function toJSON(content, messageEmbed) {
            let json = {};
            if (content)
                json.content = content;
            json.embed = {};
            if (messageEmbed.title)
                json.embed.title = messageEmbed.title;
            if (messageEmbed.description)
                json.embed.description = messageEmbed.description;
            if (messageEmbed.url)
                json.embed.url = messageEmbed.url;
            if (messageEmbed.color)
                json.embed.color = messageEmbed.color;
            if (messageEmbed.timestamp)
                json.embed.timestamp = new Date(messageEmbed.timestamp);
            if (messageEmbed.footer) {
                json.embed.footer = {};
                if (messageEmbed.footer.iconURL)
                    json.embed.footer.icon_url = messageEmbed.footer.iconURL;
                if (messageEmbed.footer.text)
                    json.embed.footer.text = messageEmbed.footer.text;
            }
            if (messageEmbed.thumbnail) {
                json.embed.thumbnail = {};
                if (messageEmbed.thumbnail.url)
                    json.embed.thumbnail.url = messageEmbed.thumbnail.url;
            }
            if (messageEmbed.image) {
                json.embed.image = {};
                if (messageEmbed.image.url)
                    json.embed.image.url = messageEmbed.image.url;
            }
            if (messageEmbed.author) {
                json.embed.author = {};
                if (messageEmbed.author.url)
                    json.embed.author.url = messageEmbed.author.url;
                if (messageEmbed.author.name)
                    json.embed.author.name = messageEmbed.author.name;
                if (messageEmbed.author.iconURL)
                    json.embed.author.icon_url = messageEmbed.author.iconURL;
            }
            if (messageEmbed.fields)
                json.embed.fields = messageEmbed.fields;
            return JSON.stringify(json, undefined, 2);
        }
        function toBleed(content, messageEmbed) {
            let color = ''
            let description = ''
            let json = {};
            if (content)
                json.content = content;
            json.embed = {};
            if (messageEmbed.title)
                json.embed.title = messageEmbed.title;
            if (messageEmbed.description)
                description = `{description; ${messageEmbed.description}}`
            if (messageEmbed.url)
                json.embed.url = messageEmbed.url;
            if (messageEmbed.color)
                color = `{color; ${messageEmbed.color}}`
            if (messageEmbed.timestamp)
                json.embed.timestamp = new Date(messageEmbed.timestamp);
            if (messageEmbed.footer) {
                json.embed.footer = {};
                if (messageEmbed.footer.iconURL)
                    json.embed.footer.icon_url = messageEmbed.footer.iconURL;
                if (messageEmbed.footer.text)
                    json.embed.footer.text = messageEmbed.footer.text;
            }
            if (messageEmbed.thumbnail) {
                json.embed.thumbnail = {};
                if (messageEmbed.thumbnail.url)
                    json.embed.thumbnail.url = messageEmbed.thumbnail.url;
            }
            if (messageEmbed.image) {
                json.embed.image = {};
                if (messageEmbed.image.url)
                    json.embed.image.url = messageEmbed.image.url;
            }
            if (messageEmbed.author) {
                json.embed.author = {};
                if (messageEmbed.author.url)
                    json.embed.author.url = messageEmbed.author.url;
                if (messageEmbed.author.name)
                    json.embed.author.name = messageEmbed.author.name;
                if (messageEmbed.author.iconURL)
                    json.embed.author.icon_url = messageEmbed.author.iconURL;
            }
            if (messageEmbed.fields)
                json.embed.fields = messageEmbed.fields;
            return `{embed}$v${color}$v${description}`
        }
    }
}