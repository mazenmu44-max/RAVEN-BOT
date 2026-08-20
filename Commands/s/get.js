const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
module.exports = {
    name: 'copyembed',
    aliases: ['embedcode'],
    run : async (client, message, args) => {
        const link = args[0]
        if (!link) return;
        message.guild.channels.cache.forEach( async (channel) => {
            if (channel.type === 'GUILD_TEXT') {
                const messages = await channel.messages.fetch({ limit: 100 })
                messages.forEach((msg) => {
                    if (msg.url === link) {
                    if (!msg.embeds || !msg.embeds.length) return;
                    const json = toBleed(msg.content, msg.embeds[0])
                    const copyembed = new MessageEmbed()
                        .setDescription(`${emojis.approve} ${message.author}: **Successfully copied the embed code**\`\`\`${json}\`\`\``).setColor(colors.approve)
                    message.channel.send({
                        embeds: [copyembed]
                    })
                    }
                })
            } else {
                return;
            }
        })
        function toBleed(content, messageEmbed) {
            let embed = []
            let color = ''
            let description = ''
            let json = {};
            if (content)
                json.content = content;
            json.embed = {};
            if (messageEmbed.title)
                embed.push(`$title ${messageEmbed.title} `)
            if (messageEmbed.description)
                embed.push(`$description ${messageEmbed.description} `)
            if (messageEmbed.url)
                embed.push(`$url ${messageEmbed.url} `)
            if (messageEmbed.color)
                embed.push(`$color ${messageEmbed.hexColor} `)
            if (messageEmbed.timestamp)
                embed.push(`$timestamp ${new Date(messageEmbed.timestamp)}}`)
            if (messageEmbed.footer) {
                if (messageEmbed.footer.text)
                    embed.push(`$footer ${messageEmbed.footer.text} `)
                if (messageEmbed.footer.iconURL)
                    embed.push(`&& ${messageEmbed.footer.iconURL} `)
            }
            if (messageEmbed.thumbnail) {
                embed.push(`$thumbnail ${messageEmbed.thumbnail.url} `)
            }
            if (messageEmbed.image) {
                embed.push(`$image ${messageEmbed.image.url} `)
            }
            if (messageEmbed.author) {
                if (messageEmbed.author.name) {
                    embed.push(`$author ${messageEmbed.author.name} `)
                }
                if (messageEmbed.author.iconURL) {
                    embed.push(`&& ${messageEmbed.author.iconURL} `)
                }
                if (messageEmbed.author.url) {
                    embed.push(`&& ${messageEmbed.author.url} `)
                }
            }
            if (messageEmbed.fields) {
                messageEmbed.fields.forEach(async (field) => {
                    embed.push(`$field ${field.name} && ${field.value} && ${field.inline}`)
                })
            }
            return embed[0].replace('$v', '') + embed.slice(1).join('')
        }
        function toJSON(content, messageEmbed) {
            let json = {};
            if (content) json.content = content;
            json.embed = {};
            if (messageEmbed.title) json.embed.title = messageEmbed.title;
            if (messageEmbed.description) json.embed.description = messageEmbed.description;
            if (messageEmbed.url) json.embed.url = messageEmbed.url;
            if (messageEmbed.color) json.embed.color = messageEmbed.color;
            if (messageEmbed.timestamp) json.embed.timestamp = new Date(messageEmbed.timestamp);
            if (messageEmbed.footer) { 
                json.embed.footer = {};
                if (messageEmbed.footer.iconURL) json.embed.footer.icon_url = messageEmbed.footer.iconURL;
                if (messageEmbed.footer.text) json.embed.footer.text = messageEmbed.footer.text; 
            }
            if (messageEmbed.thumbnail) {
                json.embed.thumbnail = {};
                if (messageEmbed.thumbnail.url) json.embed.thumbnail.url = messageEmbed.thumbnail.url;
            }
            if (messageEmbed.image) {
                json.embed.image = {};
                if (messageEmbed.image.url) json.embed.image.url = messageEmbed.image.url;
            }
            if (messageEmbed.author) {
                json.embed.author = {};
                if (messageEmbed.author.url) json.embed.author.url = messageEmbed.author.url;
                if (messageEmbed.author.name) json.embed.author.name = messageEmbed.author.name;
                if (messageEmbed.author.iconURL) json.embed.author.icon_url = messageEmbed.author.iconURL;
            }
            if (messageEmbed.fields) json.embed.fields = messageEmbed.fields;

            return JSON.stringify(json, undefined, 2);
        }
    }
}