const {
  Client,
  Message,
  Collection,
  MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json');
const axios = require("axios");
const emojis = require('../../Data/emojis.json');
const colors = require('../../Data/colors.json')
const Discord = require('discord.js');
const db = require("../../Models/lastfm");
const rp = require('request-promise')
const crownsSchema = require('../../Models/crowns')
const errorSchema = require('../../Models/errors')
const pagination = require('../../Functions/pagination')

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @returns Last.fm WhoKnows Artist
 */

const whoknows = async (client, message, personText, embed, data, artistName) => {
  try {
    const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=user.getrecenttracks&user=${data.lname}&limit=1&format=json`).catch((e) => {});
    const positions = [];
    const people = [];
    let tracks = res.data.recenttracks.track;
    let artist = artistName ? artistName.toLowerCase() : tracks[0].artist["#text"];
    const artistCheck = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=artist.getinfo&artist=${artist}&autocorrect=1&format=json`).catch((e) => {});
    if (!artistCheck.data || !artistCheck.data.artist) return message.channel.send({
      embeds: [new Discord.MessageEmbed({
        description: `${emojis.deny} ${message.author}: Invalid artist according to **Last.fm**`,
        color: colors.deny
      })]
    });
    const members = await db.find();
    await Promise.all(members.map(async (target) => {
      const mem = message.guild.members.cache.get(target.userID);
      if (!mem) return;
      const newData = await db.findOne({
        userID: mem.user.id
      });
      if (!newData) return;
      const artistRes = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=artist.getinfo&artist=${artist}&username=${newData.lname}&autocorrect=1&format=json`).catch((e) => {});
      const artistData = artistRes.data;
      if (!artistData) return;
      const playCounts = artistData.artist.stats.userplaycount;
      let obj = {
        name: mem.user.tag,
        id: mem.id,
        text: `[**${mem.user.tag}**](https://last.fm/user/${newData.lname})`,
        plays: parseInt(playCounts).toLocaleString(),
      };
      positions.push(obj);
      if (playCounts > 0) { 
      return people.push(obj);
      }
    }));
    let i = 0;
    let nameOfArtist = artistCheck.data.artist.name.charAt(0).toUpperCase() + artistCheck.data.artist.name.slice(1);
    const sortedPos = await Promise.all(positions.sort((a, b) => parseInt(b.plays.replace(',', '')) - parseInt(a.plays.replace(',', ''))));
    const sorted = await Promise.all(people.sort((a, b) => parseInt(b.plays.replace(',', '')) - parseInt(a.plays.replace(',', ''))));
    let crownUser = []
    let crownId = []
    let crownPlays = []
    let crownLastfm = []
    const whoknowsMapped = sorted.map((map) => {
      return map
    });
    if (whoknowsMapped.length == 0) {
      embed.setDescription(`:mag_right: ${message.author}: No results were found for **${nameOfArtist}**`).setColor('#7189da');
      return message.channel.send({
        embeds: [embed],
      });
    }
    const posFind = sortedPos.find(u => u.id == message.author.id);
    const userPos = sorted.find(u => u.id == message.author.id) ? `#${sortedPos.indexOf(posFind) + 1}` : "Unranked";
    const whoknowsPages = [];
    var whoknowsIndex = 0

    var whoknowsData = whoknowsMapped.pager(10);
    for (var page of whoknowsData) {
      const items = page.map((text) => {
        ++whoknowsIndex
        if (whoknowsIndex === 1) {
          crownUser.push(`${text.name}`)
          crownId.push(`${text.id}`)
          crownPlays.push(`${text.plays}`)
          crownLastfm.push(`${text.text}`)
        }
        var mapped = `\`${whoknowsIndex}\` ${text.text} has **${text.plays}** plays`
        mapped = mapped.replace('\`1\`', '👑')
        return `${mapped}`
      }).join("\n");
      var entry = new MessageEmbed()
      .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
      .setTitle(`Who Knows ${nameOfArtist}?`).setDescription(`${items}\nYour plays: **${posFind.plays}** - Rank: \`${userPos}\``).setFooter({ text : `${posFind.plays == 0 ? 'Missing plays? Use ,lastfm update to index your plays' : ''}` })
      whoknowsPages.push(entry);
    }
    if (whoknowsPages.length > 1) {
      await pagination(message, whoknowsPages, whoknowsData.length, whoknowsIndex, `\n${posFind.plays == 0 ? 'Missing plays? Use ,lastfm update to index your plays' : ''}`);
    } else {
      message.channel.send({
        embeds: [whoknowsPages[0]]
      });
    }
    const crownData = await crownsSchema.findOne({
      guildId: message.guild.id,
      artistName: nameOfArtist
    })
    if (!crownData) {
      const newCrown = new crownsSchema({
        guildId: message.guild.id,
        artistName: nameOfArtist,
        userPlays: `${crownPlays}`,
        userId: `${crownId}`,
        userTag: `${crownUser}`
      })
      newCrown.save()
      const newCrownEmbed = new MessageEmbed()
        .setDescription(`${crownLastfm} claimed the crown for "**${nameOfArtist}**"`)
        .setColor(colors.color)
    } else if (crownData) {
      if (crownData.userId !== `${crownId}`) {
        await crownsSchema.findOneAndDelete({
          artistName: nameOfArtist,
          userId: crownData.userId,
          userTag: crownData.userTag
        })
        const newCrown = new crownsSchema({
          guildId: message.guild.id,
          artistName: nameOfArtist,
          userPlays: `${crownPlays}`,
          userId: `${crownId}`,
          userTag: `${crownUser}`
        })
        newCrown.save()
        const newCrownEmbed = new MessageEmbed()
          .setDescription(`\`${crownUser}\` took the crown from \`${crownData.userTag}\` for **${nameOfArtist}**!`)
        message.channel.send({
          embeds: [newCrownEmbed]
        })
      } else {
        return;
      }
    }
  } catch (error) {
    console.log(error)

    function token() {
      var tokenText = "";
      var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 13; i++) tokenText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      return tokenText;
    }
    const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **lastfm whoknows**. Try again later.`).setColor(colors.warn).setFooter({
      text: `${token()}`
    })
    message.channel.send({
      embeds: [errorEmbed]
    })
    const newError = new errorSchema({
      errorToken: token(),
      errorText: `${error}`,
      errorCommand: `lastfm whoknows`,
      errorAuthor: `${message.author.tag}`,
      errorAuthorId: `${message.author.id}`,
      errorGuild: `${message.guild.name}`,
      errorGuildId: `${message.guild.id}`,
      errorChannel: `${message.channel.name}`,
      errorChannelId: `${message.channel.id}`,
    })
    newError.save()
  }
};

module.exports = whoknows;