const {
    Client,
    Message,
    MessageEmbed
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns Last.fm Collage
 */

const collage = async (client, message, data, args) => {
    const collage = (`https://lastfm-collage.herokuapp.com/collage?username=${data.lname}&method=album&period=7d&column=3&row=3&caption=false&scrobble=false`)
    let msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`:gear: ${message.author}: Working on generating your **album collage**...`).setColor('#7289da')] })
    function wait(ms) { let start = new Date().getTime(); let end = start; while (end < start + ms) {end = new Date().getTime();} } wait(3500)
    await msg.delete()
    message.channel.send({ embeds : [new MessageEmbed().setImage(collage).setTitle(`${data.lname}'s overall album collage`).setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })] })
};

module.exports = collage;