const client = require('../bleed');
const reactionhistorySchema = require('../Models/Moderation/reactionhistory')
const { MessageEmbed } = require('discord.js')
const emojis = require('../Data/emojis.json')
const colors = require('../Data/colors.json')
const config = require('../Data/config.json')
const { Database } = require('quickmongo');
const db = new Database(config.mongoURI, `paginationDatabase`);
const pagination = require('../Models/Servers/pagination')

// Reaction History Event
client.on('messageReactionAdd', async (messageReaction, user) => {
    try {
        const reactionhistoryData = await reactionhistorySchema.findOne({ messageId: messageReaction.message.id });
        if (!reactionhistoryData) {
            let historyItem = {};
            historyItem.messageId = messageReaction.message.id
            historyItem.reactionsHistory = [{ author: user.tag, reaction: messageReaction.emoji.id === null ? messageReaction.emoji.name : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`, type: 'add' }];
            let newhistoryItem = await reactionhistorySchema.create(historyItem);
            newhistoryItem.save();
        } else if (reactionhistoryData) {
            reactionhistoryData.reactionsHistory.push({ author: user.tag, reaction: messageReaction.emoji.id === null ? messageReaction.emoji.name : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`, type: 'add' },);
            await reactionhistorySchema.findOneAndUpdate({ messageId: messageReaction.message.id, }, reactionhistoryData);
        }
    } catch (error) {
        return console.log(error)
    }
})

// Pagination Event
client.on("messageReactionAdd", async (messageReaction, user) => {
    const serverrules1 = new MessageEmbed().setAuthor({ name : 'SERVER RULES' }).setDescription(`*this server has no jail. mods can and will ban on first offense.*\nas always, please follow the [Discord’s Terms of Service](https://discordapp.com/tos)`).addField(`${emojis.warn} **BE COURTEOUS**`, `> respect everyone including staff members and be civil.`).addField(`${emojis.warn} **NO SLURS**`, `> don't use bigoted language with the intent to attack others or offend anyone.`).addField(`${emojis.warn} **KEEP CHANNELS ON TOPIC**`, `> try to discuss things in their appropriate channels, keep shitposting out of bot channels.`).setFooter({ text : `Page 1 of 2` }).setColor(colors.help)
    const serverrules2 = new MessageEmbed().setAuthor({ name : 'SERVER RULES' }).setDescription(`*this server has no jail. mods can and will ban on first offense.*`).addField(`${emojis.warn} **NO SPAMMING**`, `> spamming can take the form of text, bot commands, reactions, images, or other disruptive messages.`).addField(`${emojis.warn} **NO ADVERTISING**`, `> this includes in users' DMs.`).addField(`${emojis.warn} **HAVE COMMON SENSE**`, `> use your brain before you ask questions.`).setFooter({ text : `Page 2 of 2` }).setColor(colors.help)
    let embeds = [serverrules1, serverrules2]
    if (messageReaction.message.id !== '961674476158865478') return;
    if (user.id === client.user.id) return;
    let index = await db.get(`${messageReaction.message.id}`)
    if (!index) index = 0;
    try {
        if (messageReaction.emoji.name === '⬅️') {
            messageReaction.users.remove(user)
            index = index > 0 ? --index : embeds.length - 1;
            db.set(`961674476158865478`, index)
            await messageReaction.message.edit({ embeds: [embeds[index]]});//.setFooter({ text : `Page ${index} of ${embeds.length}` })] });
          } else if (messageReaction.emoji.name === '➡️') {
            messageReaction.users.remove(user)
            index = index + 1 < embeds.length ? ++index : 0;
            db.set(`961674476158865478`, index)
            await messageReaction.message.edit({ embeds: [embeds[index]]});//.setFooter({ text : `Page ${index} of ${embeds.length}` })] });
          }
    } catch (error) {
        return console.log(error)
    }
})

client.on('messageReactionAdd', async (messageReaction, user) => {
  if (messageReaction.message.id === '969145953598717952') {
    if (messageReaction.emoji.name === '☑️') {
      const role = messageReaction.message.guild.roles.cache.get('969144318638043136')
      const member = messageReaction.message.guild.members.cache.get(user.id)
      await member.roles.add(role.id)
    }
  }
})

const Starboard = require('../Models/Starboard/starboards')
const Discord = require('discord.js')
// STARBOARD EVENT
client.on('messageReactionAdd', async (reactions, message, user) => {
  let config = await Starboard.findOne({ guild: reactions.message.guild.id });
  if (!config) return;

  if (config.channel !== null) {
    let color = '#ffffff', staram = config.threshold, emoteneeded = config.emoji;
    let displaystar = client.emojis.cache.get(emoteneeded) ? client.emojis.cache.get(emoteneeded) : emoteneeded;
    if (reactions.count >= staram) {
      let handleStarboard = async () => {
        let starchan = client.channels.cache.get(config.channel);
        if (starchan) {
            const fetchedMSG = await reactions.message.fetch();
            const msgs = await starchan.messages.fetch({ limit: 100 });
            const existingmsg = msgs.find(msg =>
              msg.embeds.length === 1 ?
                (msg.embeds[0] && msg.embeds[0].description === reactions.message.content) : false);
          if (existingmsg) {
            await existingmsg.edit(`${displaystar} **#${reactions.count}**`, existingmsg.embeds[0])
          } else {
            let starboardembed = new Discord.MessageEmbed()
              .setAuthor(`${fetchedMSG.member.displayName}`, fetchedMSG.author.displayAvatarURL(), `${fetchedMSG.url}`)
              .setColor(fetchedMSG.member.displayHexColor)
              .setDescription(fetchedMSG.content)
              .addField(`**#${fetchedMSG.channel.name}**`, `[Jump to message](${fetchedMSG.url})`, true)
              .setTimestamp()
            fetchedMSG.embeds.forEach(embeds => {
              console.log(embeds)
              if (embeds.thumbnail !== null) {
                starboardembed.setThumbnail(embeds.thumbnail.proxyURL);
              } if (embeds.image !== null) {
                starboardembed.setImage(embeds.image.proxyURL);
              } if (embeds.title !== null) {
                starboardembed.setTitle(embeds.title)
              } if (embeds.description !== null) {
                starboardembed.setDescription(embeds.description);
              } if (embeds.url !== null) {
                starboardembed.addField(`**#${fetchedMSG.channel.name}**`, `[Jump to message](${fetchedMSG.url})`, true)
              }
              starboardembed.fields = embeds.fields;
            })
            fetchedMSG.attachments.forEach(attachment => {
              if (attachment.url.indexOf("jpeg") >= 0 || attachment.url.indexOf("png") >= 0 || attachment.url.indexOf("gif") >= 0 || attachment.url.indexOf("jpg") >= 0) {
                starboardembed.setImage(attachment.proxyURL);
              }
            });
            await starchan.send({ embeds: [starboardembed], content: `${displaystar} **#${reactions.count}**` })
          }
        }
      }
      if (reactions.emoji.name === emoteneeded || reactions.emoji.id === emoteneeded) {
        if (reactions.message.partial) {
          await reactions.fetch();
          await reactions.message.fetch()
          await handleStarboard();
        } else {
          await handleStarboard();
        }
      }
    }
  }
})