const pagination = require('../../Functions/pagination');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roldadadadades',
    module: 'misc',
    description: 'list all roles in the guild',
    run: async (client, message, args) => {
        let listData = [];
        message.guild.roles.cache.forEach(async (role) => {
            listData.push({ role: `${role}` });
        })
        if (!listData.length < 0) return message.channel.send({ embeds: [new MessageEmbed({ description: `:mag_right: ${message.author}: No **roles** were found in **${message.guild.name}**`, color: `#7189da` })] });
        const listOfEmbeds = [];
        let i = 0;
        let pagedData = listData.pager(10);
        pagedData.forEach((page) => {
            let items = page.map((list) => { return `\`${++i}\` ${list.role}` }).join("\n");
            const listEmbed = new MessageEmbed()
                .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle(`List of roles`)
                .setDescription(`${items}`)
                .setColor(message.member.displayHexColor)
                .setFooter({ text: `Page 1/1 (${i} entries)` })
            listOfEmbeds.push(listEmbed);
        });
        if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
    }
}