const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json');
const axios = require("axios");
let apiKey = "6245df282e7ba09748fb801fe27ad66d";

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @returns
 */

const topartists = async (client, message, personText, embed, data, args) => {
  const user = message.mentions.members.first() || message.author
  const person = await client.users.cache.get(user.id)
  var period = '';
  var title = '';
  if (!args[2]) {
    period = '';
    title = "'s overall top artists";
  } else if (args[2] === `weekly` || args[2] === '1w') {
    period = "&period=7day";
    title = "'s weekly top artists";
  } else if (args[2] == "1m" || args[2] === '1month') {
    period = "&period=1month";
    title = "'s monthly top artists";
  } else if (args[2] == "3months" || args[2] == '3m') {
    period = "&period=3month";
    title = "'s past 3 months top artists";
  } else if (args[2] == "6months" || args[2] == '6m') {
    period = "&period=6month";
    title = "'s past 6 months top artists";
  } else if (args[2] == "12months" || args[2] == `yearly` || args[2] === '1y' || args[2] === '1year') {
    period = "&period=12month";
    title = "'s yearly top artists";
  } else {
    period = '';
    title = "'s overall top artists";    
  }
  const res = await axios.get(
    `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${data.lname}&api_key=${apiKey}&limit=10&format=json${period}`
  );
  if (!res || res.status == 404)
    return message.reply(await personText(person, message.author, "noTopArtists"));

  const artists = res.data.topartists.artist;
  if (artists.length <= 0)

    return message.reply(await personText(person, message.author, "noTopArtists"));

  if (artists.length > 10) {
    artists.pop();
  }

  let artistIndex = 0;

  let mapped = artists.map((artist) => {
    const plays = parseInt(artist.playcount).toLocaleString();
    return `\`${++artistIndex}\` **[${artist.name}](${artist.url
      })** (${plays} plays)`;
  });

  let user2 = await message.mentions.members.first() || message.member;

  embed
    .setColor(user2.displayHexColor || config.color)
    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({
      dynamic: true
    }))
    .setTitle(`${data.lname}${title}`)
    .setDescription(mapped.join("\n"))

  message.channel.send({
    embeds: [embed],
  });
};

module.exports = topartists;