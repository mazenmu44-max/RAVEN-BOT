const error = require('../../Functions/Client/error')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'test',
    run : async (client, message, args) => {
        const embed = new MessageEmbed().setDescription(`Your server's vanity URL was changed in **${message.guild.name}**\n**${message.author.tag}** changed \`oldVanity\` to \`newVanity\`, but this action was reversed immediately preventing losing your vanity URL`)
        message.channel.send({embeds:[embed]})
        const embed2 = new MessageEmbed().setDescription(`A dangerous role was added in your server **${message.guild.name}**\n**${message.author.tag}** gave \`role\` to a member`)
        message.channel.send({embeds:[embed2]})
        const embed3 = new MessageEmbed().setDescription(`A potential nuke has been detected in your server **${message.guild.name}**\n**${message.author.tag}** mass kicked **1/1** within \`0\` seconds and was removed of power`)
        message.channel.send({embeds:[embed3]})
        const embed4 = new MessageEmbed().setDescription(`A dangerous permission was granted in your server **${message.guild.name}**\n**${message.author.tag}** granted \`permission\` to a role, but this action was reversed immediately`)
        message.channel.send({embeds:[embed4]})
        const embed5 = new MessageEmbed().setDescription(`A dangerous role was added in your server **${message.guild.name}**\n**${message.author.tag}** gave \`role\` to a member, but this action was reversed immediately preventing any potential nuke`)
        message.channel.send({embeds:[embed5]})
        const embed6 = new MessageEmbed().setDescription(`A dangerous role was removed in your server **${message.guild.name}**\n**${message.author.name}** removed \`role\` from a member, but this action was reversed immediately preventing any potential nuke`)
    },
};