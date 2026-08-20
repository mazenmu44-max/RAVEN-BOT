const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const colors = require('../../Data/colors.json');

const axios = require("axios");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @returns Last.fm recent tracks
 */

const recent = async (client, message, personText, embed, data) => {
  const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=user.getrecenttracks&format=json&user=${data.lname}&limit=10`).catch((e) => {});
  let tracks = res.data.recenttracks.track;
  //console.log(res.data)
  //console.log(res.data.recenttracks)
  let recentIndex = 0;
  if (tracks.length <= 0) return message.reply(personText(user, message.author, "noRecentTracks"));
  if (tracks.length > 10) { tracks.pop(); }
  let mapped = [];
  for (let track of tracks) {
   // if (track.date === undefined) return;
    const timestamp = track.date !== undefined ? `<t:${track.date.uts}:R>` : 'Now Playing'
    const artist = track.artist["#text"];
    const trackInfo = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=track.getinfo&username=${data.lname}&track=${track.name}&artist=${artist}&format=json&autocorrect=true`).catch((e) => {});
    let plays;
    let trackData;
    if (trackInfo) trackData = trackInfo.data.track;
    if (!trackData) plays = "0";
    if (trackData) plays = parseInt(trackData.userplaycount).toLocaleString();
    ++recentIndex
    var i = ''
    if (recentIndex < 10) i = '0'
    mapped.push(`\`${i}${recentIndex}\` **[${track.name}](${track.url})** - **${artist}** (${timestamp})`);
  }
  mapped = await Promise.all(mapped);
  let user2 = await message.mentions.members.first() || message.member;
  embed.setColor(colors.color)
  .setTitle(`${data.lname}'s recently played tracks`).setDescription(mapped.join("\n"))
  message.channel.send({ embeds: [embed] });
};

module.exports = recent;