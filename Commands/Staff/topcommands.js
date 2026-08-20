const topcmds = require('../../Models/topcmds')
const pagination = require('../../Functions/pagination')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'topcommands',
    description : 'View the most used commands',
    usage : 'Syntax: topcommands',
    module : 'misc',
    run : async (client, message, args) => {
        let array = []
        await topcmds.find({ client : client.user.id }).then((d) => {
            d.forEach((d2) => {
                array.push({ command : d2.command, uses : d2.uses })
            })
        })
        array = array.sort((a, b) => b.uses - a.uses)
        if (array.length === 0) return message.channel.send('nah')
        const topcommandPages = [];
        let topcommandIndex = 0;
        const topcommandPager = array.pager(10);
        topcommandPager.forEach((page) => {
            const items = page.map((topcommand) => { return `\`${++topcommandIndex}\` **${topcommand.command}**: used \`${topcommand.uses}\` ${topcommand.uses === 1 ? 'time' : 'times'}`; }).join('\n');
            topcommandPages.push(new MessageEmbed().setAuthor({ name : message.member.displayName, iconURL : message.author.displayAvatarURL({ dynamic: true }) }).setTitle('Top commands since 3/20/22').setColor(message.member.displayHexColor).setDescription(items).setFooter({ text : `Page 1/1 (${topcommandPages === 1 ? 'entry' : 'entries'})` }))
        });
        if (topcommandPages.length > 1) { await pagination(message, topcommandPages, topcommandPager.length, topcommandIndex, ` (${topcommandIndex} ${topcommandIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [topcommandPages[0]] }); }
    }
}