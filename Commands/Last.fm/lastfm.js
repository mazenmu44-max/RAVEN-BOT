// Emojis & Config
const config = require('../../Data/config.json');
const emojis = require('../../Data/emojis.json');
const colors = require('../../Data/colors.json');

// Last.fm functions
const setFunction = require("../../subCommands/LastFM/set.js");
const recentFunction = require("../../subCommands/LastFM/recent.js");
const toptracksFunction = require("../../subCommands/LastFM/toptracks.js");
const topartistsFunction = require("../../subCommands/LastFM/topartists.js");
const whoknowsFunction = require("../../subCommands/LastFM/whoknows.js");
const globalwhoknowsFunction = require("../../subCommands/LastFM/globalwhoknows.js");
const wktrackFunction = require("../../subCommands/LastFM/wktrack.js");
const globalwktrackFunction = require("../../subCommands/LastFM/globalwktrack.js");
const crownsFunction = require('../../subCommands/LastFM/crowns')
const historyFunction = require('../../subCommands/LastFM/history')
const customcommandFunction = require('../../subCommands/LastFM/customcommand')
const playingFunction = require('../../subCommands/LastFM/playing')
const collageFunction = require('../../subCommands/LastFM/collage')

// Options: []
const color = { name: 'lastfm color', description: 'Set embed color for Last.fm commands', aliases: 'embed', parameters: 'hexc', usage: 'Syntax: lastfm color <hex or other mode>\nExample: lastfm color dominant' }
const whois = { name: 'lastfm whois', aliases: 'profile', parameters: 'member', usage: 'Syntax: lastfm whois (member)\nExample: lastfm whois nick#1337' }
const react = { name: 'lastfm react', description: 'Set server upvote and downvote reaction for Now Playing', aliases: 'reaction, reactions', parameters: 'emoji1, emoji2', information: `${emojis.warn} Manage Guild`, usage: 'Syntax: lastfm react <upvote reaction> <downvote reaction>\nExample: lastfm react 👍 👎' }
const recent = { name: 'lastfm recent', description: 'View your recent tracks', aliases: 'recenttracks, last, lp', parameters: 'member', usage: 'Syntax: lastfm recent <member>\nExample: lastfm recent nick#1337' }
const customcommand = { name: 'lastfm customcommand', description: 'Set your own custom Now Playing command', aliases: 'customnp, customfm, cc', parameters: 'substring', usage: 'Syntax: lastfm customcommand (substring)\nExample: lastfm customcommand nickfm -- public' }
const wktrack = { name: 'lastfm wktrack', description: 'View the top listeners for a specific song by an artist', aliases: 'wkt, whoknowstrack', parameters: 'the', usage: 'Syntax: lastfm wktrack (artist) - <track>\nExample: lastfm wktrack Ecco2k - AAA Powerline' }
const mode = { name: 'lastfm mode', description: 'Use a different embed for NP or create your own', parameters: 'stuff', information: `${emojis.warn} Donator Only`, usage: 'Syntax: lastfm mode <type or embed code>\nExample: lastfm mode check' }
const toptracks = { name: 'lastfm toptracks', description: 'View your most listened to tracks', aliases: 'track, tracks, ttr, toptrack, tt', parameters: 'member, search', usage: 'Syntax: lastfm toptracks (member) <period>\nExample: lastfm toptracks nick#1337 7d'}
const topartists = { name: 'lastfm topartists', description: 'View your most listened to artists', aliases: 'artists, artist, tar, topartist, ta', parameters: 'member, search', usage: 'Syntax: lastfm topartists (member) <period>\nExample: lastfm topartists nick#1337 7d'}
const set = { name: 'lastfm set', description: 'Set your Last.fm username', parameters: 'search', information: `${emojis.cooldown} 30 seconds`, usage: 'Syntax: lastfm set <username>\nExample: lastfm set a_valid_username' }
//const customreactions = { name: 'lastfm customreact', description: 'Set personal upvote and downvote reaction for Now Playing', aliases: 'customreactions, customreaction, cr', parameters: 'emoji1, emoji2', information: `${emojis.warn} Donator Only`, usage: 'Syntax: lastfm customreactions <upvote reaction> <downvote reaction>\nExample: lastfm customreactions 👍 👎'}
//const spotify = { name: 'lastfm spotify', description: 'Gives Spotify link for the current song playing', aliases: 'sp', parameters: 'member', usage: 'Syntax: lastfm spotify <member>\nExample: lastfm spotify nick#1337' }
const globalwhoknows = { name: 'lastfm globalwhoknows', description: 'View the top listeners for an artist globally', aliases: 'globalwk, gwk', parameters: 'artist', information: `${emojis.cooldown} 5 seconds`, usage: 'Syntax: lastfm globalwhoknows <artist>\nExample: lastfm globalwhoknows The Weekend' }
const globalwktrack = { name: 'lastfm globalwktrack', description: 'View the top listeners for a track globally', aliases: 'globalwkt, gwkt', parameters: 'the', information: `${emojis.cooldown} 5 seconds`, usage: 'Syntax: lastfm globalwktrack <artist>\nExample: lastfm globalwktrack The Weekend' }
const youtube = { name: 'lastfm youtube', description: 'Gives Youtube link for the current song playing', aliases: 'yt', parameters: 'member', usage: 'Syntax: lastfm youtube <member>\nExample: lastfm youtube nick#1337' }
const whoknows = { name: 'lastfm whoknows', description: 'View the top listeners for an artist in a guild', aliases: 'wk', parameters: 'artist', usage: 'Syntax: lastfm whoknows <artist>\nExample: lastfm whoknows The Weekend'}
// Schemas, Last.fm & Prefix
const lastfmSchema = require("../../Models/lastfm");
const prefixSchema = require('../../Models/prefix');

// Other stuff
const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

const web_api = require('spotify-web-api-node'); const spotify = new web_api({ clientId: config.spotifyClientId, clientSecret: config.spotifyClientSecret });

module.exports = {
  name : 'lastfm',
  module : 'LastFM',
  description : 'Interact with LastFM using your connected account!',
  aliases : ['lf', 'lfm'],
  information : 'Module: **LastFM**',
  arguments : { required : ['subcommand'] },
  usage : { syntax : 'lastfm (command) <subcommand?>', examples : [`lastfm topartists ${config.ownertag} 7d`, `lastfm whoknows Summrs`] },
  commands : [
    {
      name : 'mommy',
    },
    {
      name : 'daddy',
      description : 'UGHHH :weary:'
    },
    {
      name : 'fat NIGGA',
      description : ':tired_face:'
    }
  ],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns Last.fm
   */

  run: async (client, message, args, prefix) => {
    const subCmds = ['playsall', 'overview','collage', 'unlink','playing', 'whoknowsartist', 'wkartist', 'wka', 'globalwhoknowsartist', 'globalwkartist', 'globalwka', 'gwhoknowsartist', 'gwkartist', 'gwka', 'history', 'color', 'embed', 'whois', 'profile', 'react', 'reaction', 'reactions', 'recent', 'recenttracks', 'last', 'lp', 'customcommand', 'customnp', 'customfm', 'cc', 'wktrack', 'wkt', 'whoknowstrack', 'mode', 'toptracks', 'track', 'ttr', 'toptrack', 'tt', 'topartists', 'artists', 'artist', 'topartist', 'ta', 'set', 'tar', 'customreactions', 'customreact', 'customreaction', 'cr', 'spotify', 'sp', 'globalwhoknows', 'globalwk', 'gwk', 'globalwktrack', 'globalwkt', 'gwkt', 'youtube', 'yt', 'whoknows', 'wk', 'crowns'];
    const taCmds = ['topartists', 'artists', 'artist', 'tar', 'topartist', 'ta']; // Top artists
    const ttCmds = ['toptracks', 'track', 'tracks', 'ttr', 'toptrack', 'tt']; // Top tracks
    const gwktCmds = ['globalwktrack', 'globalwkt', 'gwkt']; // Global who knows track
    const gwkCmds = ['globalwhoknows', 'globalwk', 'gwk', 'globalwhoknowsartist', 'globalwkartist', 'globalwka', 'gwhoknowsartist', 'gwkartist', 'gwka']; // Global who knows
    const wktCmds = ['wktrack', 'wkt', 'whoknowstrack']; // Who knows track
    const wkCmds = ['whoknows', 'wk', 'whoknowsartist', 'wkartist', 'wka']; // Who knows
    //message.channel.sendTyping();
    let subCmd = args[0];
    if (!subCmd) return message.channel.send({embeds: [new Discord.MessageEmbed({description: `You can view the **LastFM** commands at https://github.com/n6ck/help`, color: colors.color })]});
    subCmd = subCmd.toLowerCase();
    if (!subCmds.includes(subCmd)) return message.channel.send({embeds: [new Discord.MessageEmbed({description: `You can view the **LastFM** commands at https://github.com/n6ck/help`, color: colors.color })]});
    const user = message.mentions.users.last() || message.author;
    const data = await lastfmSchema.findOne({ userID: user.id, });
    if (subCmd === 'customcommand' || subCmd === 'customnp' || subCmd === 'customfm' || subCmd === 'cc') {
      return await customcommandFunction(client, message, args)
    } else if (subCmd === 'overview') {
      const access_token = await spotify.clientCredentialsGrant().then(async (data) => data.body['access_token'])
      let listOfAlbums = []
      let listOfTracks = []
      let listOfSimilarArtists = []
      let totalScrobbles = ''
      const axios = require('axios')
      await axios({
        method : 'get', url : 'https://api.spotify.com/v1/search?q=SoFaygo&type=artist&limit=1',
        headers : { authorization : `Bearer ${access_token}` }
      }).then(async (artist) => {
        const artist_id = artist.data.artists.items[0].id
        await axios({
          method: 'get', url : `https://api.spotify.com/v1/artists/${artist_id}/albums`,
          headers : { authorization : `Bearer ${access_token}` }
        }).then(async (albums) => {
          await albums.data.items.forEach(async (album) => {
            const album_id = album.id
            await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${config.lastfmApiKey}&artist=SoFaygo&album=${album.name.split(' ').join('+')}&username=nickskv&format=json`).catch(() => {}).then(async (results) => {
              if (results) {
                if (results.data) {
                  if (results.data.album.userplaycount > 0) {
                    const array = []; listOfAlbums.map((a) => array.push(a.album))
                    if (!array.includes(results.data.album.name)) {
                      listOfAlbums.push({ album : results.data.album.name, album_url : results.data.album.url, playcount : results.data.album.userplaycount })
                    await axios({ method : 'get', url : `https://api.spotify.com/v1/albums/${album_id}/tracks`, headers : { authorization : `Bearer ${access_token}` } }).then(async (tracks) => {
                        await tracks.data.items.forEach(async (track) => {
                          await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${config.lastfmApiKey}&artist=SoFaygo&track=${track.name.split(' ').join('+')}&username=nickskv&format=json`).then(async (result) => {
                            const array2 = []; listOfTracks.map((a) => array2.push(a.track))
                    if (!array2.includes(result.data.track.name)) listOfTracks.push({ track : result.data.track.name, track_url : result.data.track.url, playcount : result.data.track.userplaycount })
                        })
                        })
                      })
                    }
                  }
                }
              }
            })
          })
        })
      })
      await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=SoFaygo&api_key=${config.lastfmApiKey}&limit=3&format=json`).then(async (results) => {
        await results.data.similarartists.artist.forEach(async (artist) => {
          listOfSimilarArtists.push(`${artist.name}`)
        })
      })
      await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=SoFaygo&api_key=${config.lastfmApiKey}&username=nickskv&format=json`).then(async (results) => {
        totalScrobbles = results.data.artist.stats.userplaycount
      })
      setTimeout(() => {
        const embed = new MessageEmbed()
        .setAuthor({ name : `${message.member.displayName}`, iconURL : message.member.displayAvatarURL({dynamic:true}) })
        .setTitle(`nickskv's overview for SoFaygo`)
        .setDescription(`You have **${totalScrobbles}** scrobbles, **${listOfAlbums.length}** albums and **${listOfTracks.length}** tracks played
        **SoFaygo** is similar to: ${listOfSimilarArtists.join(', ')}`).setColor(message.member.displayHexColor)
        let indexAlbum = 0;
        const pagerAlbum = listOfAlbums.sort((a, b) => parseInt(b.playcount) - parseInt(a.playcount)).pager(10);
        pagerAlbum.forEach((page) => {
          if (indexAlbum === 10) return;
          const list = page.map((item) => { return `\`${++indexAlbum}\` [**${item.album}**](${item.album_url}) (${item.playcount} plays)`}).join("\n");
          embed.addField(`**Top albums**`, `${list.slice(0, 1024)}`, true)
        });
        let indexTrack = 0;
        const pagerTrack = listOfTracks.sort((a, b) => parseInt(b.playcount) - parseInt(a.playcount)).pager(10);
        pagerTrack.forEach((page) => {
          if (indexTrack === 10) return;
          const list = page.map((item) => { return `\`${++indexTrack}\` [**${item.track}**](${item.track_url}) (${item.playcount} plays)`}).join("\n");
          embed.addField(`**Top tracks**`, `${list.slice(0, 1024)}`, true)
        });
        message.channel.send({embeds : [embed]})
      }, 1000)
    } else if (subCmd === 'playsall') {

      let album_name = ''
      let listOfTracks = [];
      const axios = require('axios')
      const access_token = await spotify.clientCredentialsGrant().then(async (data) => data.body['access_token'])

      await axios({ method : 'GET', url : `https://api.spotify.com/v1/search?q=${args.slice(1).join(' ')}&type=album&limit=1`, headers : { authorization : `Bearer ${access_token}` } }).then(async (album) => {
        album.data.albums.items.forEach(async (item) => {
          album_name = item.name
          await axios({ method: 'GET', url : `https://api.spotify.com/v1/albums/${item.id}/tracks`, headers : { authorization : `Bearer ${access_token}` } }).then(async (tracks) => {
            tracks.data.items.forEach(async (track) => {
              await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${config.lastfmApiKey}&artist=${item.artists[0].name.split(' ').join('+')}&track=${track.name.split(' ').join('+')}&username=${data.lname}&format=json`).then(async (lf) => {
                listOfTracks.push({ track : lf.data.track.name, track_url : lf.data.track.url, playcount : lf.data.track.userplaycount })
              })
            })
          })
        })
      })
      setTimeout(async() => {
        const embeds = []; let trackIndex = 0; const trackPager = listOfTracks.sort((a, b) => parseInt(b.playcount) - parseInt(a.playcount)).pager(10);
          trackPager.forEach((page) => {
            const list = page.map((item) => { return `\`${++trackIndex}\` [**${item.track}**](${item.track_url}) (${item.playcount} plays)`}).join("\n");
            const embed = new MessageEmbed()
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.member.displayAvatarURL({ dynamic : true }) })
            .setTitle(`${data.lname}'s track plays for album ${album_name}`).setDescription(`${list}`); embeds.push(embed)
          });
          const pagination = require('../../Functions/pagination')
          if (embeds.length > 1) { await pagination(message, embeds, embeds.length, trackIndex, ` (${trackIndex} ${trackIndex === 1 ? 'entry' : 'entries'}) - Tracklist from Spotify`) } else { message.channel.send({ embeds : [embeds[0]] }) }
      }, 1000)
    }
    if (subCmd == "unlink") {
      if (message.author.id !== '917210373051011142') return;
      const u = client.users.cache.get(args[1])
      if (u) {
        await lastfmSchema.findOne({ userID : u.id }).then(async(data)=>{
          if (data) {
            await lastfmSchema.findOneAndDelete({ userID : u.id, lname : data.lname })
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Unlinked **${u.tag}**'s **Last.fm account** `).setColor(colors.approve)] })
          }
        })
      }
    }
    if (subCmd == "set") { return await setFunction(client, message, data, args); }
    if (!data || !data.lname) return message.channel.send(await personText(user, message.author, "notConnected"));
    const embed = new MessageEmbed().setColor(config.color);
    if (subCmd == 'collage') {
      await collageFunction(client, message, data)
    }
    else if (subCmd == 'history') {
      await historyFunction(client, message, args)
    } else if (subCmd == 'crowns') { await crownsFunction(client, message, data) 
    } else if (subCmd == 'playing') {
      await playingFunction(client, message, personText, embed, data, args.slice(1).join(" "))
    } else if (subCmd == "recent") { await recentFunction(client, message, personText, embed, data); } else if (ttCmds.includes(subCmd)) { await toptracksFunction(client, message, personText, embed, data); } else if (taCmds.includes(subCmd)) { await topartistsFunction(client, message, personText, embed, data, args); } else if (wkCmds.includes(subCmd)) { await whoknowsFunction(client, message, personText, embed, data, args.slice(1).join(" ")); } else if (gwkCmds.includes(subCmd)) { await globalwhoknowsFunction(client, message, personText, embed, data, args.slice(1).join(" ")); } else if (wktCmds.includes(subCmd)) { await wktrackFunction(client, message, personText, embed, data, args.slice(1).join(" ")); } else if (gwktCmds.includes(subCmd)) { await globalwktrackFunction(client, message, personText, embed, data, args.slice(1).join(" ")); }
  },
};
async function personText(person, author, type) {
  const client = require('../../raven')
  if (person.id == author.id) {
    const notConnected = new MessageEmbed()
    .setDescription(`You haven't connected your **LastFM** profile yet, run \`lastfm set\` to set your account!`).setColor(colors.color)
    if (type == "notConnected") return { embeds: [notConnected] }
    if (type == "noTopTracks") return `<@${author.id}>: No results were found for this account or **Last.fm** returned no data`;
    if (type == "noRecentTracks") return "You do not have any recent tracks!";
    if (type == "noTopArtists") return `You do not have any top artists yet!`;
  } else {
    const notConnected = new MessageEmbed()
    .setDescription(`${emojis.lastfm} ${author}: Looks like **${person.username}** doesnt have their username set.\nThey can connect their **Last.fm** using \`,lastfm set <username>\``).setColor('#ff0000')
    if (type == "notConnected") return { embeds: [notConnected] };
    if (type == "noTopTracks") return `${person.username} No results were found for **${person.username}** or **Lastfm** returned no data`;
    if (type == "noRecentTracks") return `${person.username} does not have any recent tracks yet!`;
    if (type == "noTopArtists") return `${person.username} does not have any top artists yet!`;
  }
};