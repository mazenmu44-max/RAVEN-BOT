// Packages
const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const Discord = require('discord.js');
const axios = require("axios");

// Schemas
const lastfmSchema = require("../../Models/lastfm");
const errorSchema = require("../../Models/errors")

// Functions
const pagination = require('../../Functions/pagination')

// Other
const config = require('../../Data/config.json');
const colors = require('../../Data/colors.json');

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @returns Last.fm whoknows (worldwide)
 */

const globalwhoknows = async (client, message, personText, embed, data, artistName) => {
      try {
        const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=user.getrecenttracks&user=${data.lname}&limit=1&format=json`).catch((e) => {});

        const positions = [];
        const people = [];

        let tracks = res.data.recenttracks.track;
        let artist = artistName ? artistName : tracks[0].artist["#text"];

        const artistCheck = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=artist.getinfo&artist=${artist}&autocorrect=1&format=json`).catch((e) => {});

        if (!artistCheck.data || !artistCheck.data.artist) return message.channel.send({
          embeds: [new Discord.MessageEmbed({
            description: `${message.author}: the artist you supplied is invalid according to **last.fm**`,
            color: colors.color
          })]
        });

        const members = await lastfmSchema.find();

        await Promise.all(members.map(async (target) => {
          const user = client.users.cache.get(target.userID);
          if (!user) return;
          const newData = await lastfmSchema.findOne({
            userID: user.id
          });
          if (!newData) return;
          const artistRes = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=artist.getinfo&artist=${artist}&username=${newData.lname}&autocorrect=1&format=json`).catch((e) => {});
          const artistData = artistRes.data;
          if (!artistData) return;
          const playCounts = artistData.artist.stats.userplaycount;
          let obj = {
            id: user.id,
            name: user.tag,
            text: `[**${user.tag}**](https://last.fm/user/${newData.lname})`,
            plays: parseInt(playCounts).toLocaleString(),
          };
          positions.push(obj);
          if (playCounts > 0) {
            return people.push(obj);
          }
        }));

        let nameOfArtist = artistCheck.data.artist.name.charAt(0).toUpperCase() + artistCheck.data.artist.name.slice(1);

        const sortedPos = await Promise.all(positions.sort((a, b) => parseInt(b.plays.replace(',', '')) - parseInt(a.plays.replace(',', ''))));
        const sorted = await Promise.all(people.sort((a, b) => parseInt(b.plays.replace(',', '')) - parseInt(a.plays.replace(',', ''))));

        const whoknowsMapped = sorted.map((map) => {
          if (map && map.id === message.author.id) return `${map.text} - **${map.plays}** plays — **YOU**`
          if (map) return `${map.text} - **${map.plays}** plays`;
        });

        if (whoknowsMapped.length == 0) {
          embed.setDescription(`${message.author}: there are no listeners for "**${nameOfArtist}**" according to **last.fm**`).setColor(colors.color);
          return message.channel.send({
            embeds: [embed]
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
            var i = ''
            if (whoknowsIndex < 10) i = '0'
            const mapped = `\`${i}${whoknowsIndex}\` ${text}`
            return `${mapped}`
          }).join("\n");
          var entry = new MessageEmbed().setTitle(`Who knows artist "**${nameOfArtist}**" worldwide?`).setColor(colors.color).setDescription(`${items}`)
          whoknowsPages.push(entry);
        }
        if (whoknowsPages.length > 1) {
          await pagination(message, whoknowsPages, whoknowsData.length, whoknowsIndex, `Your rank: ${userPos} — Playcount: ${posFind.plays} ∙ `);
        } else {
          return message.channel.send({
            embeds: [whoknowsPages[0]]
          });
        }
      } catch (error) {
        console.log(error)
        function token() { var tokenText = "";
        var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 30; i++) tokenText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)); return tokenText; }
        const errorEmbed = new MessageEmbed().setDescription(`an error occured while invoking command **lastfm globalwhoknows**`).setColor(colors.color).setFooter({text: `error: ${token()}`})
        message.channel.send({ embeds: [errorEmbed] })
        const newError = new errorSchema({ errorToken: token(), errorText: `${error}`, errorCommand: `lastfm whoknows`, errorAuthor: `${message.author.tag}`, errorAuthorId: `${message.author.id}`, errorGuild: `${message.guild.name}`, errorGuildId: `${message.guild.id}`, errorChannel: `${message.channel.name}`, errorChannelId: `${message.channel.id}`,})
        newError.save()
      }
    };
    
    module.exports = globalwhoknows;