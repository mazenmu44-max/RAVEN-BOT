const pagination = require('../../Functions/pagination')
const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
module.exports = {
    name: 'invites',
    module: 'misc',
    description: 'list all invites in the guild',
    run: async (client, message, args) => {
        // Start of members function
        let listData = [];
        const invites = await message.guild.invites.fetch()
        invites.forEach(async (invite) => { 
            listData.push(`https://discord.gg/${invite.code}`); })
        if (!listData) 
        return message.channel.send({ embeds: [new MessageEmbed({description: `${emojis.warn} ${message.author}: No valid invites for this guild`, color: colors.warn })] });
            const listEmbed = new MessageEmbed()
            .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setTitle(`Guild Invites`)
            .setDescription(`\`\`\`${listData.join(', ')}\`\`\``).setColor(message.member.displayHexColor)
            message.channel.send({embeds : [listEmbed]})
            
    }
}