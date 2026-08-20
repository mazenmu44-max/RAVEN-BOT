const pagination = require('../../Functions/pagination')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'emojis',
    module: 'misc',
    description: 'list all emojis in the guild',
    run: async (client, message, args) => {
        // Start of members function
        let listData = [];
        message.guild.emojis.cache.forEach(async (e) => { 
            listData.push({ emoji: `${e} [${e.name}](https://cdn.discordapp.com/emojis/${e.id})` }); })
        if (!listData) return message.channel.send({ embeds: [new MessageEmbed({description: `:mag_right: ${message.author}: No **members** were found`, color: `#7189da` })] });
        const listOfEmbeds = [];
        let i = 0;
        let pagedData = listData.pager(10);
        pagedData.forEach((page) => {
            let items = page.map((list) => { ++i; return `${list.emoji}` }).join("\n");
            const listEmbed = new MessageEmbed()
            .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setTitle(`List of emotes`)
            .setDescription(`${items}`).setColor(message.member.displayHexColor)
            .setFooter({ text: `Page 1/1 (${i} ${i == 1 ? 'entry' : 'entries'})`})
            listOfEmbeds.push(listEmbed);
        });
        if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i, ` (${i} ${i == 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
        // End of members function
    }
}