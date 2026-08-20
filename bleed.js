console.clear();
const config = require("./Data/config.json");
const Discord = require("discord.js");
const { Client } = require('discord.js')

const client = new Client({ 
    restTimeOffset: 0, 
    disableMentions: "everyone", 
    disableMentions: "here", 
    fetchAllMembers: true, 
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER', 'USER'], intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES","GUILD_VOICE_STATES","GUILD_PRESENCES","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING","GUILD_EMOJIS_AND_STICKERS",],/// ws: { properties: { $browser: "Discord iOS" } } 
});

const mongoose = require('mongoose'); mongoose.connect(config.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }).then(console.log(`connection to mongoDB established`))

client.db = require('./Util/mongoose')

// JSON
client.emotes = require('./Data/emojis.json')
client.colors = require('./Data/colors.json')
client.config = require('./Data/config.json')

// COLLECTIONS
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.subcommands = new Discord.Collection();
client.subaliases = new Discord.Collection()
client.events = new Discord.Collection();
client.lastfm = new Discord.Collection();

client.on('warn', console.log)
client.on('debug', console.log)
const { pagination } = require('./Functions/newpag')
const { warning } = require('./Functions/Embeds/warning')
const { approve } = require('./Functions/Embeds/approve')
const { deny } = require('./Functions/Embeds/deny')
const { help } = require('./Functions/Embeds/help')
const { search } = require('./Functions/Embeds/search')

// EMBEDS
client.pagination = pagination
client.warning = warning
client.success = approve
client.failure = deny
client.search = search
client.help = help

const { MessageEmbed } = require('discord.js') 
client.embed = MessageEmbed
module.exports = client;

["command", "event", "lastfm"].forEach(handler => { require(`./Handlers/${handler}`)(client); });



Object.defineProperty(Array.prototype, "pager", { 
    value: function (n) { return Array.from(Array(Math.ceil(this.length / n)), (_, i) => this.slice(i * n, i * n + n) ); }, });


process.on('unhandledRejection', (reason, p) => { console.error(reason, 'Unhandled Rejection at Promise', p); }).on('uncaughtException', err => { console.error(err, 'Uncaught Exception thrown'); });

client.login(config.token);

const discordModals = require('discord-modals') // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals



