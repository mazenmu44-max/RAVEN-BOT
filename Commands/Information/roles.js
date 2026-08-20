const pagination = require('../../Functions/pagination');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name : 'roles',
    description : 'View all roles in the server',
    usage : 'Syntax: roles',
    module : 'information',
    
    run: async (client, message, args) => {
        let listData = [];
        message.guild.roles.cache.sort((a, b) => b.position - a.position).forEach(async (role) => {
           if (!role.name.includes('@everyone')) listData.push({ role: `${role}` });
        })
        if (!listData.length < 0) return;
        const listOfEmbeds = []
        let i = 0;
        let pagedData = listData.pager(10);
        pagedData.forEach((page) => {
            let items = page.map((list) => { return `\`${++i}\` ${list.role}` }).join("\n");
            const listEmbed = new MessageEmbed()
                .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle(`List of roles`)
                .setDescription(`${items}`)
                .setColor(message.member.displayHexColor)
                .setFooter({ text: `Page 1/1 (${i} ${i === 1 ? 'entry' : 'entries'})` })
            listOfEmbeds.push(listEmbed);
        });
        if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i, ` (${i} ${i === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
    }
}