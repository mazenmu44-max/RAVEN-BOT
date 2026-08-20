const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name : 'edit',
    run : async (client, message, args) => {
        message.delete()
        const row = new MessageActionRow().addComponents(
            new MessageButton().setStyle('SECONDARY').setLabel('Open').setEmoji('🎫').setCustomId('tickets-open').setDisabled(false)
        )
        const embed = new MessageEmbed().setAuthor({ name : `${message.guild.name}`, iconURL : message.guild.iconURL() }).setTitle('Open a Ticket').setDescription('Click the button below to open a ticket').setColor('#649097')
        message.channel.send({ content : `If you have any issues that cannot be solved in <#960214070605254696>, please open a ticket. Abusing the ticket system will result in a ban.`, embeds : [embed], components : [row] })
    }
}