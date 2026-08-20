const axios = require('axios'); const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name : 'application',
    aliases : ['app'],
    hidden : true,
    run : async (client, message, args) => {
        if (!message.author.id === '944099356678717500') return;
        const application = await client.users.fetch(client.users.resolveId(args[0] || '958040140356386887')).catch(() => null);
        if (!application || !application.bot) return;
        console.log(application)
        await axios.get(`https://discord.com/api/v9/applications/${application.id}/rpc`).then(async (results) => {
            const applicationInfo = new MessageEmbed()
            .setAuthor({ name : `${results.data.name}` })
            .setDescription(`${results.data.description || ''}`)
            .addField(`**Application**`, `**Public:** ${results.data.bot_public == true ? 'True' : 'False'}\n**Code grant:** ${results.data.bot_require_code_grant == true ? 'True' : 'False'}`)
            results.data.tags ? applicationInfo.addField(`**Tags**`, `${results.data.tags.join(', ')}`) : null
            applicationInfo.addField(`**Created**`, `<t:${Math.floor(application.createdTimestamp / 1000)}:R>`).setColor(client.color)
            results.data.icon !== null ? applicationInfo.setAuthor({ name : `${results.data.name}`, iconURL : `https://cdn.discordapp.com/avatars/${results.data.id}/${results.data.icon}.png?size=1024` }) : null  
            message.channel.send({ embeds : [applicationInfo], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('LINK').setLabel('Add to Server').setURL(`https://discord.com/api/oauth2/authorize?client_id=${application.id}&permissions=8&scope=bot%20applications.commands`))] })
        })
    }
}