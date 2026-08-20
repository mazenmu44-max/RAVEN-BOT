const crownsSchema = require('../../Models/crowns')
const pagination = require('../../Functions/pagination')
const {
    MessageEmbed
} = require('discord.js')
module.exports = {
    name: 'crowns',
    run: async (client, message, args) => {
        const member = message.mentions.users.first() || message.author
        const crownsData = await crownsSchema.find({
            guildId: message.guild.id,
            userId: member.id
        })
        let listData = [];
        crownsData.forEach((crown) => {
            listData.push({
                artist: `${crown.artistName}`,
                plays: `${crown.userPlays}`
            })
        })
        if (!listData) return message.channel.send({
            embeds: [new MessageEmbed({
                description: `:mag_right: ${message.author}: No **crowns** were found`,
                color: `#7189da`
            })]
        });
        const listOfEmbeds = [];
        let i = 0;
        let pagedData = listData.pager(10);
        pagedData.forEach((page) => {
            let items = page.map((list) => {
                const artistArray = list.artist.split(' ')
                return `\`${++i}\` [**${list.artist}**](https://www.last.fm/music/${artistArray.join('+')}) with **${list.plays}** plays`
            }).join("\n");
            const listEmbed = new MessageEmbed().setAuthor({
                    name: `${message.member.displayName}`,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                }).setTitle(`${member.username}'s claimed crowns`).setDescription(`${items}`).setColor(message.member.displayHexColor)
                .setFooter({
                    text: `Page 1/1 (${i} entries)`
                })
            listOfEmbeds.push(listEmbed);

        });
        if (listOfEmbeds.length > 1) {
            await pagination(message, listOfEmbeds, pagedData.length, i);
        } else {
            return message.channel.send({
                embeds: [listOfEmbeds[0]]
            });
        }
    }
}