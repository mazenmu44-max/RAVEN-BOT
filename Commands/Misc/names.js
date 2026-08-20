const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')

const { MessageEmbed } = require('discord.js')

const names = require('../../Models/Misc/names')

const pagination = require('../../Functions/pagination')

module.exports = {
    name : 'names',
    description : 'View username and nickname history of member or yourself',
    aliases : ['namehistory', 'nicks', 'nh'],
    parameters : 'member',
    usage : `Syntax: names <member>\nExample: names ${config.ownertag}`,
    module : 'misc',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Names
     */

    run : async (client, message, args) => {

        const member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const pastnames = await names.findOne({ user : member.id })
        if (!pastnames || pastnames.names.length < 0) return message.channel.send({ embeds : [new MessageEmbed({ description: `${emojis.warn} ${message.author}: No **logged username** or **nickname change** found`, color: colors.warn })] });
        const pages = [];
        let namesIndex = 0;
        let pager = pastnames.names.pager(10);
        for (const page of pager) {
            let items = page.map((item) => { return `\`${++namesIndex}${item.type === 'username' ? 'U' : 'N'}\` "${item.name}" (\`${item.date}\`)`; }).join("\n");
            pages.push(new MessageEmbed().setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) }).setTitle('Name history').setColor(message.member.displayHexColor).setDescription(items).setFooter({ text : `Page 1/1 (${namesIndex} entries) ∙ All times are PST` }));
        };
        if (pages.length > 1) { await pagination(message, pages, pager.length, namesIndex, ` (${namesIndex} entries) ∙ All times are PST`); } else { return message.channel.send({ embeds : [pages[0]] }); }

    },
};