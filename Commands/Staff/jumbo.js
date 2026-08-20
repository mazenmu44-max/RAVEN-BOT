const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "jumbo",
  module: "misc",
  aliases: ['e', 'enlarge', 'enlargen'],
  description: "Returns a large emoji or server emote",
  run: async (client, message, args) => {
    const authoravatar = message.author.avatarURL();
    const emoji = args[0];
    const helpjumbo = new MessageEmbed()
    .setAuthor(`${client.user.username} help`, client.user.displayAvatarURL())
    .setTitle(`Command: jumbo`)
    .setDescription(`Returns a large emoji or server emote\n\`\`\`Syntax: ,jumbo <emoji or emote>\nExample: ,jumbo 🔥\`\`\``)

    if (!emoji) return message.channel.send({embeds: [helpjumbo]});

    let customemoji = Discord.Util.parseEmoji(emoji);

    if (customemoji.id) {
      const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
        customemoji.animated ? "gif" : "png"
      }`;

      const attach = new MessageAttachment(Link, Link);
      return message.channel.send({ files: [attach] });
    } else {
      let CheckEmoji = parse(emoji, { assetType: "png" });
      if (!CheckEmoji[0]) {
        const invalid = new MessageEmbed()
        .setDescription(`${message.author}: Can't find that emoji/invalid`)
        return message.channel.send({embeds: [invalid]});
      } else if (CheckEmoji[0]) {
        return
      }
    }
  },
};