const {
    MessageEmbed
} = require('discord.js')
const historySchema = require('../../Models/LastFM/history')
const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
const pagination = require('../../Functions/reactionPagination')
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns Last.fm History
 */

const history = async (client, message, args) => {
    if (message.author.id !== '917210373051011142') return;
    message.channel.send('recognized')
    if (!args[0]) return;
    const user = message.mentions.users.first() || client.users.cache.get(args[0])
    if (!user) return;
    const historyData = await historySchema.findOne({
        userId: user.id
    })
    if (!historyData || historyData.pastUsernames.length < 0) return message.channel.send('no data')
    const listOfEmbeds = [];
    let i = 0;
    let itemsCount = 0;
    let pagedData = historyData.pastUsernames.pager(10);
    pagedData.forEach((page) => {
        page.forEach(() => ++itemsCount);
    });

    pagedData.forEach((page) => {
        let gs = page
            .map((user) => {
                return `\`${++i}\` [**${user.username}**](https://last.fm/user/${user.username}) (date: ${user.date}) (time: ${user.time})`
            })
            .join("\n");

        const embed = new MessageEmbed()
            .setTitle(`**${user.username}**'s last.fm history`)
            .setColor(colors.color)
            .setDescription(gs)
            .setFooter({ text: `all times are PST`})
        listOfEmbeds.push(embed);
    });

    if (listOfEmbeds.length > 1) {
        await pagination(message, listOfEmbeds, pagedData.length, itemsCount);
    } else {
        return message.channel.send({
            embeds: [listOfEmbeds[0]]
        });
    }
};

module.exports = history;