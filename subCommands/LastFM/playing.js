// Packages
const { Client, Message, MessageEmbed } = require("discord.js");
const axios = require("axios");
  
// Schemas
const lastfmSchema = require("../../Models/lastfm");
const errorSchema = require("../../Models/errors")

// Functions
  const pagination = require('../../Functions/reactionPagination')
  
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
  
  const playing = async (client, message, personText, embed, data, artistName) => {
      var peopleArray = []
      const members = await lastfmSchema.find();
      await Promise.all(members.map(async (target) => {
            const user = m
            essage.guild.members.cache.get(target.userID);
            if (!user) return;
            const newData = await lastfmSchema.findOne({ userID: user.id });
            if (!newData) return;
            if (!newData || !newData.lname) return;    
            const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${config.lastfmApiKey}&method=user.getrecenttracks&user=${newData.lname}&limit=1&format=json`).catch(e => {});
            if (res.status == 404) return;
            let tracks = res.data.recenttracks.track;
            const track = tracks[0];
            if (!track) return;
            const artist = track.artist['#text'];
            let playingObject = {
                user: `${user.user.username}`,
                track: track.name,
                trackURL: track.url,
                artist: artist
            };
            if (res.data.recenttracks.track[0]['@attr']) { return peopleArray.push(playingObject); } else { return; }
          }));
          const playingPages = [];
          var playingIndex = 0
  
          var playingData = peopleArray.pager(10);
          for (var page of playingData) {
            const items = page.map((text) => {
        ++playingIndex
              var i = ''
              if (playingIndex < 10) i = '0'
              const mapped = `\`${text.user}\` [**${text.track}**](${text.trackURL}) by **${text.artist}**`
              return `${mapped}`
            }).join("\n");
            var entry = new MessageEmbed().setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) }).setTitle(`Currently being played now in ${message.guild.name}`).setColor(message.member.displayHexColor).setDescription(`${items}`).setFooter({ text: `Page 1/1 (${playingIndex} ${playingIndex === 1 ? 'entry' : 'entries'})`})
            playingPages.push(entry);
          }
          if (playingPages.length > 1) {
            await pagination(message, playingPages, playingData.length, playingIndex, ` (${playingIndex} ${playingIndex === 1 ? 'entry' : 'entries'})`);
          } else {
            return message.channel.send({
              embeds: [playingPages[0]]
            });
          }
      };
      
      module.exports = playing;