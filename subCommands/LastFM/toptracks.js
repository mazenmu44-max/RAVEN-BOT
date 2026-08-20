const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json');
const axios = require("axios");
let apiKey = "PUT URS HERE";

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @returns top tracks
 */

const toptracks = async (client, message, personText, embed, data) => {
  const user = message.mentions.members.first() || message.author
  const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=user.gettoptracks&format=json&user=${data.lname}&limit=10`).catch((e) => {});
  const person = await client.users.cache.get(user.id)
  const desc = await personText(person, message.author, "noTopTracks");
  if (res.status == 404) return message.channel.send(desc);
  let tracks = res.data.toptracks.track;
  if (tracks.length <= 0) return message.channel.send(desc);
  if (tracks.length > 10) tracks.pop();
  let topTrackIndex = 0;
  let mapped = [];
  for (let track of tracks) {
    const artist = track.artist.name;
    const trackInfo = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=track.getinfo&username=${data.lname}&track=${track.name}&artist=${artist}&format=json&autocorrect=true`).catch((e) => {});
    let plays;
    let trackData;
    if (trackInfo) trackData = trackInfo.data.track;
    if (!trackData) plays = "N/A";
    if (trackData) plays = parseInt(trackData.userplaycount).toLocaleString();
    mapped.push(`\`${++topTrackIndex}\` **[${track.name}](${track.url})** by **${artist}** (${plays} plays)`);
  }
  mapped = await Promise.all(mapped);
  let user2 = await message.mentions.members.first() || message.member;
  embed.setAuthor({ name: `${message.member.displayName}` }).setColor(user2.displayHexColor || config.color).setTitle(`${data.lname}'s top tracks!`).setDescription(mapped.join("\n"))
  message.channel.send({ embeds: [embed], });
};

module.exports = toptracks;