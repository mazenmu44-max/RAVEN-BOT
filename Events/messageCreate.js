const client = require('../bleed');
const Discord = require('discord.js');
const config = require('../Data/config.json');
const emojis = require('../Data/emojis.json');
const colors = require('../Data/colors.json');
const { Collection } = require("discord.js");
const { MessageEmbed } = require('discord.js')
const Timeout = new Collection();


// LASTFM
let apiKey = "6245df282e7ba09748fb801fe27ad66d";

// SCHEMAS
const blacklistUser = require('../Models/Staff/blacklist');
const prefixData = require('../Models/Servers/prefixes');
const commandSchema = require('../Models/command');
const fakepermsSchema = require('../Models/fakepermissions')
const moment = require('moment')

var owners = [
  "917210373051011142",
  "849604824047812629"
]

const ms = require('ms');
const fetch = require('node-fetch')

let { igApi, getSessionId } = require('insta-fetcher');

const topcmds = require('../Models/topcmds')
client.on('messageCreate', async (message) => {
  console.log(message.content)
  if (!message.guild || message.author.bot) return;
  if (!false) {
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}> |${escapeRegex('raven')})\\s*`);
    let mention = null;
    try {
      [, mention] = message.content.toLowerCase().match(prefixRegex);
    } catch (e) {

    }

    if (!message.member) message.member = await message.guild.fetchMember(message);

    if (message.content.startsWith('.')) {

      const args = message.content.slice('.'.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (cmd.length == 0) return;
      const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      if (command) {
        if (!message.guild.me.permissions.has(`SEND_MESSAGES`)) return
        if (!message.guild.me.permissions.has(`EMBED_LINKS`)) return
        let perms = {
          MANAGE_CHANNELS: "manage_channels",
          MANAGE_MESSAGES: "manage_messages",
          MANAGE_GUILD: "manage_guild",
          MANAGE_WEBHOOKS: "manage_webhooks",
          MANAGE_ROLES: "manage_roles",
          MANAGE_EMOJIS_AND_STICKERS: "manage_emojis",
          MANAGE_NICKNAMES: "manage_nicknames",
          MANAGE_THREADS: "manage_threads",
          ADD_REACTIONS: "add_reactions",
          CREATE_INSTANT_INVITE: "create_instant_invite",
          ADMINISTRATOR: "administrator",
          EMBED_LINKS: "embed_links",
          SEND_MESSAGES: "send_messages",
          KICK_MEMBERS: "kick_members",
          BAN_MEMBERS: "ban_members",
          USE_EXTERNAL_EMOJIS: "use_external_emojis",

        };
        const permsEmbed = new Discord.MessageEmbed()
          .setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`${perms[command.permissions]}\``)
          .setColor(`#ffa602`)
        if (!message.member.permissions.has(command.permissions || [])) return message.channel.send({ embeds: [permsEmbed] })
        if (message.member.permissions.has(command.permissions || [])) {
          if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`))
              return message.channel.send({
                embeds: [new Discord.MessageEmbed({
                  description: `${emojis.cooldown} ${message.author}: Please wait **** before using this command again`,
                  color: `#51c4f0`
                })]
              })//.then((x) => x.delete({ timeout: 5000 }));
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
              Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
            const check = await commandSchema.findOne({ Guild: message.guild.id })
            if (check) {
              if (check.Cmds.includes(command.name)) return;
            }
          }
      
    }
    const owner = await message.guild.fetchOwner()
    if (command) command.run(client, message, args, '.')

    } else if (message.content.toLowerCase().startsWith(message.author.username.toLowerCase())) {

      const args = message.content.slice(message.author.username.toLowerCase().split('').length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (cmd.length == 0) return;
      const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      if (command) {
          const ddd = await topcmds.findOne({ client : client.user.id, command : command.name })
          if (!ddd) { new topcmds({ client : client.user.id, command : command.name, uses : 1 }).save() } else {await topcmds.findOneAndUpdate({ client : client.user.id, command : command.name, uses : ddd.uses }, { command : command.name, uses : ddd.uses + 1})}
        const cmdLog = new MessageEmbed()
       // .setAuthor({ name : `${message.author.tag} executed a command (${message.author.id})`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
        .setColor(colors.raven)
        .setDescription(`\`\`\`${message.author.tag}: ${message.content}\`\`\``)
        .setFooter({ text : `${message.guild.name} (${message.guild.id})`})
        client.channels.cache.get('981032060036726877').send({ embeds : [cmdLog] })
        if (!message.guild.me.permissions.has(`SEND_MESSAGES`)) return
        if (!message.guild.me.permissions.has(`EMBED_LINKS`)) return
        let perms = {
          MANAGE_CHANNELS: "manage_channels",
          MANAGE_MESSAGES: "manage_messages",
          MANAGE_GUILD: "manage_guild",
          MANAGE_WEBHOOKS: "manage_webhooks",
          MANAGE_ROLES: "manage_roles",
          MANAGE_EMOJIS_AND_STICKERS: "manage_emojis",
          MANAGE_NICKNAMES: "manage_nicknames",
          MANAGE_THREADS: "manage_threads",
          ADD_REACTIONS: "add_reactions",
          CREATE_INSTANT_INVITE: "create_instant_invite",
          ADMINISTRATOR: "administrator",
          EMBED_LINKS: "embed_links",
          SEND_MESSAGES: "send_messages",
          KICK_MEMBERS: "kick_members",
          BAN_MEMBERS: "ban_members",
          USE_EXTERNAL_EMOJIS: "use_external_emojis",

        };
        const permsEmbed = new Discord.MessageEmbed()
          .setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`${perms[command.permissions]}\``)
          .setColor(`#ffa602`)
        if (!message.member.permissions.has(command.permissions || [])) return message.channel.send({ embeds: [permsEmbed] })
        if (message.member.permissions.has(command.permissions || [])) {
          if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`))
              return message.channel.send({
                embeds: [new Discord.MessageEmbed({
                  description: `${emojis.cooldown} ${message.author}: Please wait **${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}** before using this command again`,
                  color: `#51c4f0`
                })]
              })//.then((x) => x.delete({ timeout: 5000 }));
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
              Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
            const check = await commandSchema.findOne({ Guild: message.guild.id })
            if (check) {
              if (check.Cmds.includes(command.name)) return;
            }
          }
        }
    }
    const owner = await message.guild.fetchOwner()
    if (command) command.run(client, message, args, guildPrefix)

    } else if (message.content.startsWith('nick')) {

    } else if (mention) {
      const args = message.content.slice(mention.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (cmd.length == 0) return;
      const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      if (command) {
          const ddd = await topcmds.findOne({ client : client.user.id, command : command.name })
          if (!ddd) { new topcmds({ client : client.user.id, command : command.name, uses : 1 }).save() } else {await topcmds.findOneAndUpdate({ client : client.user.id, command : command.name, uses : ddd.uses }, { command : command.name, uses : ddd.uses + 1})}
        const cmdLog = new MessageEmbed()
       // .setAuthor({ name : `${message.author.tag} executed a command (${message.author.id})`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
        .setColor(colors.raven)
        .setDescription(`\`\`\`${message.author.tag}: ${message.content}\`\`\``)
        .setFooter({ text : `${message.guild.name} (${message.guild.id})`})
        client.channels.cache.get('981032060036726877').send({ embeds : [cmdLog] })
        if (!message.guild.me.permissions.has(`SEND_MESSAGES`)) return
        if (!message.guild.me.permissions.has(`EMBED_LINKS`)) return
        let perms = {
          MANAGE_CHANNELS: "manage_channels",
          MANAGE_MESSAGES: "manage_messages",
          MANAGE_GUILD: "manage_guild",
          MANAGE_WEBHOOKS: "manage_webhooks",
          MANAGE_ROLES: "manage_roles",
          MANAGE_EMOJIS_AND_STICKERS: "manage_emojis",
          MANAGE_NICKNAMES: "manage_nicknames",
          MANAGE_THREADS: "manage_threads",
          ADD_REACTIONS: "add_reactions",
          CREATE_INSTANT_INVITE: "create_instant_invite",
          ADMINISTRATOR: "administrator",
          EMBED_LINKS: "embed_links",
          SEND_MESSAGES: "send_messages",
          KICK_MEMBERS: "kick_members",
          BAN_MEMBERS: "ban_members",
          USE_EXTERNAL_EMOJIS: "use_external_emojis",

        };
        const permsEmbed = new Discord.MessageEmbed()
          .setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`${perms[command.permissions]}\``)
          .setColor(`#ffa602`)
        if (!message.member.permissions.has(command.permissions || [])) return message.channel.send({ embeds: [permsEmbed] })
        if (message.member.permissions.has(command.permissions || [])) {
          if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`))
              return message.channel.send({
                embeds: [new Discord.MessageEmbed({
                  description: `${emojis.cooldown} ${message.author}: Please wait **${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}** before using this command again`,
                  color: `#51c4f0`
                })]
              })//.then((x) => x.delete({ timeout: 5000 }));
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
              Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
            const check = await commandSchema.findOne({ Guild: message.guild.id })
            if (check) {
              if (check.Cmds.includes(command.name)) return;
            }
          }
        }
    }
    const owner = await message.guild.fetchOwner()
    if (command) command.run(client, message, args, guildPrefix)

    }
  } else {
    return;
  }
}
})
client.on('messageCreate', async (message) => {
  if (message.author.id !== '917210373051011142') return;
  const prefix = 'raven clever'
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args[0]) return;
    const clever = args.slice(0).join(' ')
    const axios = require('axios')
    await axios.get(`https://www.cleverbot.com/getreply?key=${config.cleverbotApiKey}&input=${clever}`).then((res) => {
      message.reply({ content : `${res.data.output}`, allowedMentions: { repliedUser : false },})
    })
  }
})
// COMMAND FUNCTION
client.on('messageCreate', async (message) => {
  return;
  const date1 = Date.now();
  if (!message.guild) return;
    if (message.author.bot) return;
    const data = await prefixData.findOne({
      guild: message.guild.id
    })
    var prefix = ''
    if (data) prefix = data.prefix
    if (!data) prefix = config.default_prefix
    if (!message.content.startsWith(prefix)) return;
    blacklistUser.findOne({ user : message.author.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {``
        if (!message.guild) return;
        if (!message.member) message.member = await message.guild.fetchMember(message);
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length == 0) return;
        let command = client.commands.get(cmd)
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) {
          const ddd = await topcmds.findOne({ client : client.user.id, command : command.name })
          if (!ddd) { new topcmds({ client : client.user.id, command : command.name, uses : 1 }).save() } else {await topcmds.findOneAndUpdate({ client : client.user.id, command : command.name, uses : ddd.uses }, { command : command.name, uses : ddd.uses + 1})}
          //console.log(`[WS => Shard 0] [INVOKED] ${message.author.tag}: ${message.content}\nChannel: #${message.channel.name} (${message.channel.id})\nServer: ${message.guild.name} (${message.guild.id})`)
          const nahhhh = new MessageEmbed()
          .setDescription(`${message.author}: **${client.user.tag}** isn't available for public use yet, the bot is far from finished & not done yet`)
          .setColor('#a1b0bd')
          const owners = ['849604824047812629', '917210373051011142', '671744161107410968', '371224177186963460']
          //if (!owners.includes(message.author.id)) return message.channel.send({ embeds: [nahhhh] })
          if (!message.guild.me.permissions.has(`SEND_MESSAGES`)) return
          if (!message.guild.me.permissions.has(`EMBED_LINKS`)) return
          if (!message.guild.me.permissions.has(command.permissions || [])) return
          const role = message.member.roles.cache.map(role => role.id)
          const data = await fakepermsSchema.findOne({
            role: role,
            permissions: command.permissions
          })
          if (data) {
            if (command.timeout) {
              if (Timeout.has(`${command.name}${message.author.id}`))
                return message.channel.send({
                  embeds: [new Discord.MessageEmbed({
                    description: `${emojis.cooldown} ${message.author}: Please wait **${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}** before using this command again`,
                    color: `#51c4f0`
                  })]
                })//.then((x) => x.delete({ timeout: 5000 }));
              Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
              setTimeout(() => {
                Timeout.delete(`${command.name}${message.author.id}`)
              }, command.timeout)
              const check = await commandSchema.findOne({ Guild: message.guild.id })
              if (check) {
                if (check.Cmds.includes(command.name)) return;
              }
            }
          } else if (!data) {
            let perms = {
              MANAGE_CHANNELS: "manage_channels",
              MANAGE_MESSAGES: "manage_messages",
              MANAGE_GUILD: "manage_guild",
              MANAGE_WEBHOOKS: "manage_webhooks",
              MANAGE_ROLES: "manage_roles",
              MANAGE_EMOJIS_AND_STICKERS: "manage_emojis",
              MANAGE_NICKNAMES: "manage_nicknames",
              MANAGE_THREADS: "manage_threads",
              ADD_REACTIONS: "add_reactions",
              CREATE_INSTANT_INVITE: "create_instant_invite",
              ADMINISTRATOR: "administrator",
              EMBED_LINKS: "embed_links",
              SEND_MESSAGES: "send_messages",
              KICK_MEMBERS: "kick_members",
              BAN_MEMBERS: "ban_members",
              USE_EXTERNAL_EMOJIS: "use_external_emojis",

            };
            const permsEmbed = new Discord.MessageEmbed()
              .setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`${perms[command.permissions]}\``)
              .setColor(`#ffa602`)
            if (!message.member.permissions.has(command.permissions || [])) return message.channel.send({ embeds: [permsEmbed] })
            if (message.member.permissions.has(command.permissions || [])) {
              if (command.timeout) {
                if (Timeout.has(`${command.name}${message.author.id}`))
                  return message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                      description: `${emojis.cooldown} ${message.author}: Please wait **${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}** before using this command again`,
                      color: `#51c4f0`
                    })]
                  })//.then((x) => x.delete({ timeout: 5000 }));
                Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
                setTimeout(() => {
                  Timeout.delete(`${command.name}${message.author.id}`)
                }, command.timeout)
                const check = await commandSchema.findOne({ Guild: message.guild.id })
                if (check) {
                  if (check.Cmds.includes(command.name)) return;
                }
              }
            }
          }
        }
        const owner = await message.guild.fetchOwner()
        if (command) command.run(client, message, args, prefix)
      } else {
        return;
      }
    })
})

// TIKTOK FUNCTION
// NOTE: The old TikTok auto-embed feature relied on the abandoned
// "tiktok-scraper" package (unmaintained since 2021, and the sole reason
// the deploy failed to build "canvas"). It has been removed here. If you
// want TikTok embeds back, look at a maintained alternative such as
// "@tobyg74/tiktok-api-dl" or an oEmbed-based approach instead.
var unshortener = require("unshorten.it");
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(`horror`)) return;
  try {
    for (let mess of message.content.split(" ")) {
      if (mess) {
        // TikTok branch removed (see note above).
      } else if (mess.includes('https://instagram.com/') || mess.includes('https://www.instagram.com/')) {
        const session_id = await getSessionId('25235354325unt8614115021842', 'InstagramScraper123');
        let ig = new igApi(session_id);
        ig.fetchPost(mess).then(async(res) => {
          console.log(res.links)
          if (res.links[0].type === 'image') {

          } else if (res.links[0].type === 'video') {
            const response = await fetch(res.links[0].url, {
              method: 'GET'
            })
            console.log(response)
            let embed = new Discord.MessageEmbed()
          .setAuthor({ name: res.username })
          .setURL(mess)
          .setTitle(res.caption.replace('\n', ''))
          .setColor(colors.help)
          .setFooter({ text: `❤️ ${res.likes.toLocaleString()} 💬 ${res.comment_count.toLocaleString()}`, iconURL: `https://cdn.discordapp.com/emojis/754117198477393960.png` })
            const buffer = await response.buffer()
            message.channel.send({ embeds : [embed], files : [new Discord.MessageAttachment(buffer, `${res.shortcode}.mp4`)] })
          }
        });
      }
      //25235354325unt8614115021842
    }//InstagramScraper123
  } catch (e) {
    if (!message.guild.features.includes('BANNER')) {
      return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: File failed to send due to Discord's **8MB limit** for bots. Boost your server to allow the bot to send **bigger sized** files!`).setColor(colors.warn)] })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed({
       description: `${emojis.warn} ${message.author}: There was an **error** while downloading your video`,
        color: `#faa61b`
        })]
       });
    }
 }
})
client.on('messageCreate', async (message) => {
  if (message.content !== 'pushinp') return;
  const msgs = await message.channel.messages.fetch({ limit: 2 })
        msgs.forEach((msg) => {
            if (msg.id === message.id) return;
            msg.react('🅿️')
        })
})
const { afk } = require('../Collection')

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return
  const mentionedMember = message.mentions.members.first()
  if (mentionedMember) {
    const data = afk.get(mentionedMember.id)

    if (data) {
      const [ timestamp, reason ] = data
      const timeAgo = moment(timestamp).fromNow()
      afk.delete(message.author.id)
    var delta = Math.abs(new Date() - timestamp) / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;
    seconds < 10 ? seconds = Number(seconds.toString().slice(0, 1)) : seconds = Number(seconds.toString().slice(0, 2))
    const embed1 =new MessageEmbed()
      .setDescription(`:zzz: ${mentionedMember} is AFK: **${reason}** - ${days === 0 ? hours === 0 ? minutes === 0 ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`} ago`)
      .setColor(colors.raven)
    message.reply({ embeds: [embed1], allowedMentions: { repliedUser : false},  })
    }
  }
  const data = afk.get(message.member.id)
  if (data) {
    const [ timestamp, reason, created ] = data
  const timeAgo = moment(timestamp).fromNow()
  const gData = afk.get(message.author.id)
  if(gData) {
    afk.delete(message.author.id)
    var delta = Math.abs(new Date() - timestamp) / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;
    seconds < 10 ? seconds = Number(seconds.toString().slice(0, 1)) : seconds = Number(seconds.toString().slice(0, 2))
    const embed = new Discord.MessageEmbed()
    .setDescription(`:wave: ${message.author}: welcome back, you were away for **${days === 0 ? hours === 0 ? minutes === 0 ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}**`)
    .setColor(colors.raven)
    message.reply({ embeds: [embed], allowedMentions: { repliedUser : false},  })
    try {
      message.member.setNickname(`${message.member.displayName}`);
    } catch (error) {
      return
    }
  }
  }
})

// Levels Event
const Levels = require("discord-xp");
Levels.setURL(config.mongoURI);
const { Database } = require('quickmongo');
const db = new Database(config.mongoURI, `levelDb`);
client.on('messageCreate', async (message) => {
  const levelUp = await Levels.appendXp( message.author.id, message.guild.id, 6 )
  if (!db.has(`level_${message.author.id}_${message.guild.id}`)) { db.set(`level_${message.author.id}_${message.guild.id}`, 6) }
  if (db.has(`level_${message.author.id}_${message.guild.id}`)) { db.add(`level_${message.author.id}_${message.guild.id}`, 6) }
  if (levelUp) {
    db.delete(`level_${message.author.id}_${message.guild.id}`)
  }
})


const stick = require('../Models/Misc/stick')
const stickymessages = require('../Models/Servers/stickymessages')
client.on('messageCreate',async(message)=>{
  await stickymessages.findOne({ guildId : message.guild.id, channel : message.channel.id }).then(async(stickymessage)=>{
    if (stickymessage) {
      await stick.findOne({ channel : message.channel.id }).then(async(stick)=>{
        if (stick) {
          await message.channel.messages.get(stick.message).delete().then(async()=>{
            message.channel.send(`${stickymessage.message}`).then(async(msg)=>{
              await stick.findOneAndUpdate({channel:message.channel.id,message:stick.message},{channel:message.channel.id,message:msg.id})
            })
          })
        }
      })
    }
  })
})

const imgonly = require('../Models/Servers/imgonly')
client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    await imgonly.findOne({ guild : message.guild.id }).then(async (data) => {
    if (data) {
      const array = []; data.channels.map((item) => { array.push(item.channel) })
      if (array.includes(message.channel.id) && !message.attachments.first()) {
        return message.delete()
      }
    }
  })
})

//const { Database } = require('quickmongo');
const smdb = new Database(config.mongoURI, `stickymessagesDatabase`);
const stickymessage = require('../Models/Servers/stickymessages')
client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
  await stickymessage.findOne({ guild : message.guild.id }).then(async (data) => {
    if (data) {
        console.log(data)
        let filter = await data.stickyMessages.filter((item) => item.channel === message.channel.id)
        console.log(filter)
        if (filter.length > 0) {
            const msg = await smdb.get(`${message.channel.id}`)
            console.log(msg)
          const x = await message.channel.messages.fetch(msg)
          x.delete(); return message.channel.send(`${filter[0].message}`).then(async (xx) => {
              smdb.set(`${message.channel.id}`, xx.id)})
        }
    }
  })
})

const customcommands = require('../Models/LastFM/customcommands')
client.on('messageCreate', async (message) => {
    await customcommands.findOne({ guild : message.guild.id, command : message.content }).then(async (data) => {
      if (!data) return; if (data.public === trdue) {
        const nowplaying = client.commands.get('nowplaying')
        nowplaying.run(client, message, [], ',')
      } else if (data.public === false && message.author.id === data.user) {
        const nowplaying = client.commands.get('nowplaying')
        nowplaying.run(client, message, [], ',')
      }
    })
})