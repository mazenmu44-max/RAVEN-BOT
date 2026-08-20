const { Client, Message, MessageEmbed } = require("discord.js");

const axios = require("axios");
const Discord = require('discord.js');
const config = require('../../Data/config.json');
const emojis = require('../../Data/emojis.json');
const colors = require('../../Data/colors.json')
const db = require("../../Models/lastfm");
const prefixData = require('../../Models/prefix');


/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */

const set = async (client, message, data, args) => {
  const username = args.slice(1).join(" ");
  if (!username) return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: lastfm set').setDescription(`Set your LastFM username\`\`\`Syntax: lastfm set <username>\nExample: lastfm set a_valid_username\`\`\``).setColor('#718090')] });
  const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&method=user.getInfo&format=json&user=${username}`).catch((e) => { });
  if (!res || res.status != 200 || !res.data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: [**${username}**](https://LastFM/user/${username}) is not a valid LastFM account`).setColor(colors.deny)] });
  console.log(Number(res.data.user.playcount))

  if (!data) {
    let newDataObj = {
      userID: message.author.id,
      lname: username,
    };

    let saveData = await db.create(newDataObj);
    saveData.save();
    function wait(ms) { let start = new Date().getTime(); let end = start; while (end < start + ms) {end = new Date().getTime();} }
    const edit = new MessageEmbed()
    .setDescription(`Updating new account **LastFM library**...`).setColor(colors.color)
    let msg = await message.channel.send({ embeds : [edit] })
    wait(250)
    const edit2 = new MessageEmbed()
    .setDescription(`Starting **index** of your **LastFM artist library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit2] })
    if (Number(res.data.user.playcount > 0)) wait (500)
    const edit3 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **artist library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit3.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
    wait (250)
    await msg.edit({ embeds : [edit3] })
    const edit4 = new MessageEmbed()
    .setDescription(`Starting **index** of your **LastFM track library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit4] })
    if (Number(res.data.user.playcount > 0)) wait (500)
    const edit5 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **track library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit5.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
    wait (250)
    await msg.edit({ embeds : [edit5] })
    const edit6 = new MessageEmbed()
    .setDescription(`Storing **index** of your **LastFM album library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit6] })
    if (Number(res.data.user.playcount > 0)) wait (500)
    const edit7 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **album library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit7.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
    wait (250)
    await msg.edit({ embeds : [edit7] })
    const edit10 = new MessageEmbed()
      .setColor("a3eb7b")
      .setDescription(`${emojis.approve} ${message.author}: Success, your **LastFM** username has been set to [**${username}**](https://LastFM/user/${username})`)
    return msg.edit({ embeds: [edit10] })
  } else {
     

    let artist_info = await user_getlibrary(username);
    const artists = artist_info.artists ? artist_info.artists.artist : [];
    let track_info = await get_toptracks(username);
    const tracks = track_info.toptracks ? track_info.toptracks.track : [];
    let album_info = await get_topalbums(username);
    const albums = album_info.topalbums ? album_info.topalbums.album : [];

    await getLibrary(username);

    //function wait(ms) { let start = new Date().getTime(); let end = start; while (end < start + ms) {end = new Date().getTime();} }
    const edit = new MessageEmbed()
    .setDescription(`Updating new account **LastFM library**...`).setColor(colors.color)
    let msg = await message.channel.send({ embeds : [edit] })
    //wait(250)
    const edit2 = new MessageEmbed()
    .setDescription(`Starting **index** of your **LastFM artist library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit2] })
    //if (Number(res.data.user.playcount > 0)) wait (500)
    const edit3 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **artist library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit3.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
    //wait (250)
    await msg.edit({ embeds : [edit3] })
    const edit4 = new MessageEmbed()
    .setDescription(`Starting **index** of your **LastFM track library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit4] })
    //if (Number(res.data.user.playcount > 0)) wait (500)
    const edit5 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **track library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit5.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
   // wait (250)
    await msg.edit({ embeds : [edit5] })
    const edit6 = new MessageEmbed()
    .setDescription(`Storing **index** of your **LastFM album library**...`).setColor(colors.color)
    await msg.edit({ embeds : [edit6] })
    //if (Number(res.data.user.playcount > 0)) wait (500)
    const edit7 = new MessageEmbed()
    .setDescription(`Finished **indexing** of your **album library**!`).setColor(colors.color)
    if (Number(res.data.user.playcount) === 0) edit7.setDescription(`${emojis.warn} ${message.author}: Aborted **indexing** your library - you have no plays!`).setColor(colors.warn)
    //wait (250)
    await msg.edit({ embeds : [edit7] })
    const edit10 = new MessageEmbed()
      .setColor(colors.color)
      .setDescription(`Your **LastFM** profile has been set as [**${username}**](https://last.fm/user/${username}), Artists: **${artists ? parseInt(artists.length).toLocaleString() : '0'}**, Tracks: **${tracks ? parseInt(tracks.length).toLocaleString() : '0'}**, Albums: **${albums ? parseInt(albums.length).toLocaleString() : '0'}**`)
    return msg.edit({ embeds: [edit10] })
  }
};


async function user_getlibrary(user) {
  let get = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=library.getartists&user=${user}&api_key=${config.lastfmApiKey}&format=json&limit=1000`).then((res) => res.data)
  return get;
};
async function get_topalbums(user) {
  let get = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${config.lastfmApiKey}&format=json&limit=1000`).then((res) => res.data)
  return get;
};
async function get_toptracks(user) {
  let get = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${config.lastfmApiKey}&format=json&limit=1000`).then((res) => res.data)
  return get;
};
const getLibrary = async (user) => {
  await axios.get(encodeURI(`https://ws.audioscrobbler.com/2.0/?method=library.getartists&user=${user}&api_key=${config.lastfmApiKey}&format=json&limit=2000`)).then(async (results) => {
    for (const x of results.data.artists ? results.data.artists.artist : []) {
      await axios.get(encodeURI(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${x.name}&api_key=${config.lastfmApiKey}&format=json&limit=1000`)).then(async (tracks) => {
        for (const i of tracks.data.tracks ? tracks.data.tracks.track : []) {
          await axios.get(encodeURI(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${config.lastfmApiKey}&username=${user}&artist=${x.name}&track=${i.name}&format=json`)).then(async (track) => {
            console.log(track.data)
          })
        }
      })
    };
  })
}

module.exports = set

