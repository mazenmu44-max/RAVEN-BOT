const {
    Client,
    Message,
    Collection, MessageEmbed
  } = require("discord.js");
  const config = require('../../Data/config.json');
  const emojis = require('../../Data/emojis.json');
  const axios = require("axios");
  const Discord = require('discord.js');
  const db = require("../../Models/lastfm");
  
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {MessageEmbed} embed
   * @returns
   */
  
  const whoknowstrack = async (
    client,
    message,
    personText,
    embed,
    data,
    trackName
  ) => {
    const res = await axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=user.getrecenttracks&user=${data.lname}&limit=1&format=json`
      )
      .catch((e) => { });
  
    if (!res) return message.channel.send({
      embeds: [new Discord.MessageEmbed({
        description: `${emojis.lastfm} ${message.author}: Operation failed - Most likely the backend service failed. Please try again.*`,
        color: `RED`
      })]
    });
  
    const positions = [];
    const people = [];
    let tracks = res.data.recenttracks.track;
    let track;
    let artist;
  
    if (trackName) {
      const searchRes = await axios
        .get(
          `http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=track.search&track=${trackName}&limit=1&format=json`
        )
        .catch((e) => { });
  
      if (!searchRes || !searchRes.data) return message.channel.send({
        embeds: [new Discord.MessageEmbed({
          description: `${emojis.deny} ${message.author}: Invalid track according to **Last.fm**`,
          color: `#fe6464`
        })]
      });
  
      let trackData = searchRes.data.results;
      let trackMatches = trackData.trackmatches.track;
      if (!trackMatches[0]) return console.log("yE");
      track = trackMatches[0].name;
      artist = trackMatches[0].artist;
    } else {
      track = tracks[0].name;
      artist = tracks[0].artist["#text"];
    }
  
    const trackCheck = await axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=track.getInfo&track=${track}&artist=${artist}&autocorrect=1&format=json`
      )
      .catch((e) => { });
  
    if (!trackCheck.data || trackCheck.error == 6) return message.channel.send({
      embeds: [new Discord.MessageEmbed({
        description: `${emojis.deny} ${message.author}: Invalid track according to **Last.fm**`,
        color: `#fe6464`
      })]
    });
  
    const members = await db.find();
  
    await Promise.all(
      members.map(async (target) => {
        const mem = message.guild.members.cache.get(target.userID);
        if (!mem) return;
  
        const newData = await db.findOne({
          userID: mem.user.id
        });
  
        if (!newData) return;
  
        const trackRes = await axios
          .get(
            `http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=track.getInfo&track=${track}&artist=${artist}&username=${newData.lname}&autocorrect=1&format=json`
          )
          .catch((e) => { });
  
        if (!trackRes || !trackRes.data) return message.reply("Track not found!")
  
        const trackData = trackRes.data.track;
        if (!trackData) return;
        const playCounts = trackData.userplaycount;
  
        let obj = {
          name: mem.user.tag,
          id: mem.id,
          text: `[**${mem.user.tag}**](https://last.fm/user/${newData.lname})`,
          plays: parseInt(playCounts).toLocaleString(),
        };
  
        positions.push(obj);
  
        if (playCounts > 0 && people.length < 11) {
          return people.push(obj);
        }
      })
    );
  
    let i = 0;
  
    let nameOfTrack = track.charAt(0).toUpperCase() + track.slice(1).toLocaleString();
  
    const sortedPos = await Promise.all(positions.sort((a, b) => parseInt(b.plays) - parseInt(a.plays)));
    const sorted = await Promise.all(people.sort((a, b) => parseInt(b.plays) - parseInt(a.plays)));
  
    const mappedText = sorted.map((viewer) => {
      if (viewer) return `\`${++i}\` ${viewer.text} has **${viewer.plays}** plays`;
    });
  
    if (mappedText.length == 0) {
      embed
        .setDescription(`:mag_right: ${message.author}: No results were found for **${nameOfTrack}**`)
        .setColor(`#7189da`);
  
      return message.channel.send({
        embeds: [embed],
      });
    }
  
  
    const posFind = sortedPos.find(u => u.id == message.author.id);
    const userPos = sorted.find(u => u.id == message.author.id) ? `#${sortedPos.indexOf(posFind) + 1}` : "Unranked";
    const embedDescription = `${mappedText.join("\n")}\nYour plays: **${posFind.plays}** - Rank: \`${userPos}\``;
  
    let user2 = await message.mentions.members.first() || message.member;
  
    embed
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({
        dynamic: true
      }))
      .setTitle(`Top Listeners for track ${nameOfTrack}`)
      .setDescription(embedDescription)
      .setColor(user2.displayHexColor || config.color);
  
    return message.channel.send({
      embeds: [embed],
    });
  };
  
  module.exports = whoknowstrack;