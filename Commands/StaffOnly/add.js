const Discord = require('discord.js');
const config = require('../../Data/config.json');
const {
  approve
} = require('../../Data/emojis.json');

module.exports = {
  name: "emoji",
  aliases: ["e"],
  userperms: "MANAGE_EMOJI",
  module: 'misc',

  run: async (client, message, args) => {

      if (!args[0]) return;
      let failed = []
    if (args[0] !== 'addmany') return;
    for (const emojis of args.slice(1)) {
      const getEmoji = Discord.Util.parseEmoji(emojis);
      if (getEmoji.id) {
        const emojiExt = getEmoji.animated ? '.gif' : '.png';
        const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`;
        message.guild.emojis.create(emojiURL, getEmoji.name)
      } else {
        failed.push('else')
      }
    }
    message.channel.send(`Added **${args.slice(1).length - failed.length} new ${args.slice(1).length == 1 ? 'emote' : 'emotes'}** to the server (\`${failed.length}\` failed)`)
  }
}