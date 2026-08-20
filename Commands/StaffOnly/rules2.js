const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
module.exports = {
    name : 'r2',
    run : async (client, message, args) => {
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setEmoji('⬅️')
            .setStyle('PRIMARY')
            .setCustomId('leftarrow'),
            new MessageButton()
            .setEmoji('➡️')
            .setStyle('PRIMARY')
            .setCustomId('rightarrow')
        )
        const row2 = new MessageActionRow().addComponents(
            new MessageButton()
            .setEmoji('☑️')
            .setStyle('PRIMARY')
            .setCustomId('verify')
        )
        const row3 = new MessageActionRow().addComponents(
            new MessageSelectMenu()
            .setMaxValues(2)
            .setPlaceholder('Choose notifications')
            .setCustomId('selectmenu')
            .setOptions(
                {
                    label : 'Bot Updates',
                    value : 'Receive notifications for bot updates.',
                    emoji : '📰'
                },
                {
                    label : 'Important Server Info',
                    value : 'Receive notifications for important server info.',
                    emoji : '🔨'
                }
            )
        )
        await message.delete()
        if (message.author.id !== '917210373051011142') return;
        const bleedwin = new MessageEmbed().setTitle('Hollow').setURL('https://discord.com/api/oauth2/authorize?client_id=928149687821819914&permissions=8&scope=bot%20applications.commands').setColor(colors.help)
        message.channel.send({ embeds : [bleedwin] })
        const serverrules1 = new MessageEmbed().setAuthor({ name : 'Server Rules', iconURL : client.user.displayAvatarURL() }).setDescription(`*This server has no jail. mods can and will ban on first offense.*\nAs always, please follow the [Discord’s Terms of Service](https://discordapp.com/tos).`).addField(`**Be Courteous**`, `Respect everyone including staff members and be civil.`).addField(`**No Slurs**`, `Don't use bigoted language with the intent to attack others or offend anyone.`).addField(`**Keep Channels on Topic**`, `Try to discuss things in their appropriate channels, keep shitposting out of bot channels.`).setFooter({ text : `Page 1 of 2` }).setColor(colors.help)
        message.channel.send({ embeds : [serverrules1], components : [row] })
        const edit = new MessageEmbed().setDescription('Null').setColor(colors.help)
        const msg = await message.channel.send({ embeds : [edit] })
        const notificationroles = new MessageEmbed().setAuthor({ name : 'Notification Roles', iconURL : client.user.displayAvatarURL() }).setDescription('Indicate how you would like to be notified of server updates.').setColor(colors.help)
        msg.edit({ embeds : [notificationroles], components : [row3]  })
        const gainaccess = new MessageEmbed().setDescription(`Click this to **gain access** to the server`).setColor(colors.help)
        message.channel.send({ embeds : [gainaccess], components : [row2] })
    }
}