const {
    Client,
    Message,
    MessageEmbed
} = require("discord.js");
const crownsSchema = require('../../Models/crowns')
const pagination = require('../../Functions/pagination')
const rp = require('request-promise')

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns Last.fm Crowns
 */

const crowns = async (client, message, data, args) => {
    const member = message.mentions.members.first() || message.member
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
    if (!listData || listData.length === 0) return message.channel.send({
        embeds: [new MessageEmbed({
            description: `:book: ${message.author}: You have **no** crowns!`,
            color: `#7189da`
        })]
    });
    const listOfEmbeds = [];
    let i = 0;
    let pagedData = listData.pager(10);
    pagedData.forEach((page) => {
        let items = page.map((list) => {
            const artistArray = list.artist.split(' ')
            return `\`${++i}\` [**${list.artist}**](https://www.last.fm/music/${artistArray.join('+')}) (${list.plays} plays)`
        }).join("\n");
            const listEmbed = new MessageEmbed().setAuthor({
                    name: `${message.member.displayName}`,
                    iconURL: message.author.displayAvatarURL({ dynamic : true })
                }).setTitle(`Crowns`).setDescription(`${items}`)
                .setFooter({
                    text: `Page 1/1 (${i} ${i === 1 ? 'crown' : 'crowns'})`
                })
            listOfEmbeds.push(listEmbed);
        });
        if (listOfEmbeds.length > 1) {
            await pagination(message, listOfEmbeds, pagedData.length, i, ` (${i} ${i === 1 ? 'crown' : 'crowns'})`);
        } else {
            return message.channel.send({
                embeds: [listOfEmbeds[0]]
            });
        }
};

module.exports = crowns;