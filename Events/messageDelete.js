const client = require('../bleed');
const config = require('../Data/config.json');
const { MessageEmbed } = require('discord.js');
// SNIPE FUNCTION
client.snipes = new Map()
client.on('messageDelete', async function (message, guild) {
  let snipes = client.snipes.get(message.channel.id) || [];
  if (snipes.length > 20) snipes = snipes.slice(0, 19);

  snipes.unshift({
    author : message.author,
    content: message.content,
    image: message.attachments.first() ?.proxyURL || null,
    timestamp : message.createdTimestamp,
  });
  client.snipes.set(message.channel.id, snipes);
})