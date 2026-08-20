const pagination = require('../../Functions/pagination')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'botsfsfsffsfsf',
    module: 'misc',
    description: 'list all bots in the guild',
    run: async (client, message, args) => {
        // Start of bots function
        let listData = [];
        message.guild.members.cache.forEach(async (member) => { if (member.user.bot) listData.push({ user: `${member.user.tag}`, id: `${member.user.id}` }); })
        if (!listData) return message.channel.send({ embeds: [new MessageEmbed({description: `:mag_right: ${message.author}: No **members** were found`, color: `#7189da` })] });
        const listOfEmbeds = [];
        let i = 0;
        let pagedData = listData.pager(10);
        pagedData.forEach((page) => {
            let items = page.map((list) => { return `\`${++i}\` **${list.user}** (\`${list.id}\`)` }).join("\n");
            const listEmbed = new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setTitle(`List of Bots`).setDescription(`${items}`).setColor(message.member.displayHexColor)
            .setFooter({ text: `Page 1/1 (${i} entries)`})
            listOfEmbeds.push(listEmbed);
            
        });
        if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
        // End of bots function
    }
}