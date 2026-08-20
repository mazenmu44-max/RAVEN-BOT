/*ERROR HANDLING*/

const { MessageActionRow } = require("discord.js");
const { MessageButton } = require('discord.js')

const { MessageEmbed } = require('discord.js')
const { Database } = require('quickmongo');
const errorSchema = require('../../Models/Client/errors')


const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')

const db = new Database(config.mongoURI, `errorDatabase`);

/**
 *
 * @returns Error
 */

const error = async (message, command, error, client) => {
    try {
        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **${command}**. Try again later.`).setColor(colors.warn).setFooter({ text : `Uhh token here ig.. ` })] });

    await errorSchema.findOne({ client : client.user.id }) !== null ? await errorSchema.findOneAndDelete({ client : client.user.id }) : null

    if (!db.has(`errors-${client.user.id}`)) { db.set(`errors-${client.user.id}`, 1) }
    if (db.has(`errors-${client.user.id}`)) { db.add(`errors-${client.user.id}`, 1) }

    const number = await db.get(`errors-${client.user.id}`)
    new errorSchema({ client : client, message : message, command : command, error : error, number : number }).save()

    } catch (error) {
        return message.channel.send(`${error}`)
    }
};
module.exports = error;