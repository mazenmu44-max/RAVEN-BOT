const { Client, Message, MessageEmbed } = require("discord.js");
const axios = require("axios");
const config = require('../../Data/config.json');
const colors = require('../../Data/colors.json');
var commaNumber = require('comma-number');
const db = require("../../Models/lastfm");
const prefixSchema = require('../../Models/prefix');
const rp = require('request-promise')
//const { getColorFromURL } = require('color-thief-node');

module.exports = {
  name: 'nowplaying',
  description: 'display your most recent song from **last.fm**',
  timeout: 2000,
  aliases: ['np', 'fm', 'now'],
  examples: `,nowplaying\n,nowplaying [member]\n,nowplaying ${config.ownertag}`,
  params: 'member',
  module: 'last.fm',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const prefixData = await prefixSchema.findOne({ guildId: message.guild.id })
    message.channel.sendTyping();
    const personText = (person, author, type) => {
      const notConnected = new MessageEmbed().setDescription(`${message.author}: you don't have your **last.fm** profile linked, try using \`,lf set [username]\``).setColor('#a1b0bd')
      const userNotConnected = new MessageEmbed().setDescription(`${message.author}: **${person.username}** doesn't have their **last.fm** profile linked,\nthey can try using \`,lf set [username]\``).setColor('#a1b0bd')
      const noNowPlaying = new MessageEmbed().setDescription(`${message.author}: you don't have any recent tracks from **last.fm**,\n or **last.fm** returned no data. try listening to some songs first`).setColor('#a1b0bd')
      const userNoNowPlaying = new MessageEmbed().setDescription(`${message.author}: **${person.username}** doesn't have any recent tracks from **last.fm**,\n or **last.fm** returned no data. they can try listening to some songs first`).setColor('#a1b0bd')
      if (person.id == author.id) {
        if (type == "notConnected") return ({ embeds: [notConnected] });
        if (type == "noNowPlaying") return ({ embeds: [noNowPlaying] });
      } else { 
        if (type == "notConnected") return ({ embeds: [userNotConnected] });
        if (type == "noNowPlaying") return ({ embeds: [userNoNowPlaying] });
      }
    };
    const user = message.mentions.users.first() || message.author;
    const data = await db.findOne({ userID: user.id });
    const embed = new MessageEmbed()
    // NOW PLAYING
    if (!data || !data.lname) return message.channel.send(personText(user, message.author, "notConnected"));
    const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=user.getrecenttracks&user=${data.lname}&limit=1&format=json`).catch(e => {});
    console.log(res.data)
    if (res.status == 404) return message.channel.send(personText(user, message.author, "noNowPlaying"));
    let tracks = res.data.recenttracks.track;
    let format = commaNumber.bindWith(',', '.')
    const track = tracks[0]
    console.log(track)
    const trackname = tracks[0].name.toUpperCase()
    if (!track) return message.channel.send(personText(user, message.author, "noNowPlaying"));
    const artist = track.artist['#text'];
    const album = track.album['#text' || 'N/A'];
    artistURL = "https://www.last.fm/music/" + `${artist.replace(/ /g, '+')}`
    albumURL = "https://www.last.fm/music/" + `${artist.replace(/ /g, '+')}/` + `${album.replace(/ /g, '+')}`
    let scrobbles = format(res.data.recenttracks['@attr'].total)
    const trackInfo = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=track.getinfo&username=${data.lname}&track=${track.name}&artist=${artist}&format=json&autocorrect=true`).catch((e) => {});
    let plays;
    let trackData;
    let status = 'Most Recent'
    if (trackInfo) trackData = trackInfo.data.track;
    if (!trackData) plays = "0";
    if (trackData) plays = parseInt(trackData.userplaycount).toLocaleString();
    if (res.data.recenttracks.track[0]['@attr']) status = `Now Playing`
    const options = {
      uri: `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${data.lname}&api_key=${config.lastfmApiKey}&format=json&extended=1`,
      headers: {
          'Connection': 'keep-alive',
          'Accept-Encoding': '',
          'Accept-Language': 'en-US,en;q=0.8',
      },
      json: true
  }
  rp(options).then(async function (userRes) {
    //const dominantColor = await getColorFromURL(track.image[3]["#text"]);
    embed.setThumbnail(track.image[3]["#text"])
    .setAuthor({ name: `LastFM: ${data.lname}`, iconURL: userRes.user.image[3]["#text"].replace('.png', '.gif') || 
    message.author.displayAvatarURL({ dynamic: true }), url : `https://www.last.fm/user/${data.lname}` })
    .setTitle(`${track.name}`)
    .setURL(track.url)
    .addField(`Artist`, `[${artist}](${artistURL})`, true)
    .addField(`Album`, `[${album}](${albumURL})`, true)
    .setFooter({ text : `Total Scrobbles: ${scrobbles} ∙ Playcount: ${plays} ∙ ${status}` })
    .setColor(colors.color)

    await message.channel.send({ embeds: [embed], }).then(async(x) => {
      await x.react('👍')
      await x.react('👎')
    })
  })
  },
};