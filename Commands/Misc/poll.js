const emojis = require('../../Data/emojis.json'), colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'poll',
    description : 'Create a short poll',
    parameters : 'time, question',
    usage : 'Syntax: poll (seconds) <question>\nExample: poll 15 Am I gay?',
    module : 'misc',
    run : async (client, message, args) => {
        let seconds = args[0]
        const question = args.slice(1).join(' ')
        if (isNaN(seconds)) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You didn't give a **valid time** for the poll`).setColor(colors.warn)] })
        if (seconds > 250) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Can't create a poll for that long, try something less than **250 seconds**`).setColor(colors.warn)] })
        const poll = new MessageEmbed()
        .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
        .setDescription(`${message.author.username} started a poll that will end after \`${seconds}\` second(s)!\nQuestion: *${question}*`)
        .setFooter({ text : `Guild: ${message.guild.name} ∙ Channel: ${message.channel.name}` }).setTimestamp()
        let msg = await message.channel.send({ embeds : [poll] })
        msg.react('👍')
        msg.react('👎')
        let upvotes = []
        let downvotes = []
        const collector = msg.createReactionCollector({ time: Number(seconds + '000') });
        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === '👍') {
                upvotes.push(reaction)
            } else if (reaction.emoji.name === '👎') {
                downvotes.push(reaction)
            }
        })
        collector.on('end', async () => {
            msg.delete()
            const pollFinished = new MessageEmbed()
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
            .setDescription(`${message.author.username} started a poll that will end after \`${seconds}\` second(s)!\nQuestion: *${question}*\n\n**Poll results:**\n👍 \`${upvotes.length - 1}\` / 👎 \`${downvotes.length - 1}\``)
            .setFooter({ text : `Guild: ${message.guild.name} ∙ Channel: ${message.channel.name}` }).setTimestamp(message.createdTimestamp)
            message.channel.send({ embeds : [pollFinished] })
        })
    }
}