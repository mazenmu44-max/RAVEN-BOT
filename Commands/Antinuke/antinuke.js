// Schemas required for antinuke
const antinukeSchema = require('../../Models/antinukes')
const adminSchema = require('../../Models/admins')
const adminlistSchema = require('../../Models/adminlists')
const antinukelistSchema = require('../../Models/antinukelists')
const whitelistSchema = require('../../Models/whitelists')
const permissionsSchema = require('../../Models/permissions')
const { Database } = require('quickmongo');
const config = require('../../Data/config.json')
const whitelistSize = new Database(config.mongoURI, `whitelistedSize`);
const whitelistBotsSize = new Database(config.mongoURI, `whitelistedBotsSize`);

// Embed configurations
const {
    MessageEmbed
} = require('discord.js')
const colors = {
    approve: 'a5ec77',
    deny: 'ef5f5c',
    warn: 'ffa602',
    blurple: '6e87c9',
    help: '718090',
    color: '#a1b0bd',
}
const emojis = require('../../Data/emojis.json')
const pagination = require('../../Functions/pagination')
const whitelists = require('../../Models/whitelists')

// Start of antinuke module
module.exports = {
    name: 'antinuke',
    aliases: ['an'],
    run: async (client, message, args, Discord) => {
        const subCommand = args[0]
        const antinukeEmbed = new MessageEmbed().setAuthor({
            name: `${client.user.username} help`,
            iconURL: `${client.user.displayAvatarURL()}`
        }).setTitle(`Command: antinuke`).setDescription(`Antinuke to protect your server\n\`\`\`Syntax: antinuke (subcommand) <args>\nExample: antinuke ban on --do ban\`\`\``).setColor(colors.help);
        if (!subCommand) return message.channel.send({
            embeds: [antinukeEmbed]
        })
        const antinukeData = await antinukeSchema.findOne({
            guildId: message.guild.id
        })
        if (!antinukeData) await antinukeSchema.create({
            guildId: message.guild.id
        })
        if (subCommand === 'configuration' || subCommand === 'config' || subCommand === 'settings') {
            const whitelistedmembers = await whitelistSize.get(`whitelistedusers_${message.guild.id}`) || 0
            const whitelistedbots = await whitelistSize.get(`whitelistedbots_${message.guild.id}`) || 0
            const configurationEmbed = new MessageEmbed()
            .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
            .setTitle(`Settings`)
            .setDescription(`Antinuke is **disabled** in this server\n**Predefined Vanity URL:** N/A`)
            .addField(`**Modules**`, `**Channel Creation/Deletion:** N/A\n**Role Deletion:** N/A\n**Emoji Deletion:** N/A\n**Mass Member Ban:** N/A\n**Mass Member Kick:** N/A\n**Webhook Creation:** N/A\n**Vanity Protection:** N/A`, true)
            .addField(`**General**`, `**Super Admins:** 0\n**Whitelisted Bots:** 0\n**Protection Modules:** 0 enabled\n**Watch Permission Grant:** 0/11 perms\n**Watch Permission Remove:** 0/11 perms\n**Deny Bot Joins (botadd):** N/A`, true)
            .setColor('#7189da')
            return message.channel.send({ embeds: [configurationEmbed] });
        } else if (subCommand === 'permissions' || subCommand === 'perms') {
            return;
        } else if (subCommand === 'admin') {

        } else if (subCommand === 'admins') {

        } else if (subCommand === 'role') {

        } else if (subCommand === 'channel') {

        } else if (subCommand === 'emoji') {

        } else if (subCommand === 'ban') {

        } else if (subCommand === 'kick') {

        } else if (subCommand === 'webhook') {

        } else if (subCommand === 'botadd') {

        } else if (subCommand == 'vanity' || subCommand === 'vanityurl') {

        } else if (subCommand === 'setvanity' || subCommand === 'setvanityurl') {

        } else if (subCommand === 'whitelist') {
            // Start of antinuke whitelist
            const argsEmbed =  new MessageEmbed().setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() }).setTitle(`Command: antinuke whitelist`).setDescription(`Whitelist a member from triggering antinuke or a bot to join\nSyntax: antinuke whitelist (member or bot id)\nExample: antinuke whitelist 917210373051011142`)
            if (!args[1]) return message.channel.send({ embeds: [argsEmbed ]});
            const member = message.mentions.members.first() || client.users.cache.get(args[1])
            const memberEmbed = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a member with the name: **${args.slice(1).join(' ')}**`).setColor(colors.warn)
            if (!member) return message.channel.send({ embeds: [memberEmbed] })
            let isBot = ''
            if (member.user.bot) isBot = `BOT`
            if (!member.user.bot) isBot = `MEMBER`
            const whitelistData = await whitelistSchema.findOne({ guildId: message.guild.id, memberId: member.id })
            if (!whitelistData) {
                const iswhitelistedEmbed = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${member.user.tag}** is now whitelisted and will not trigger **antinuke**`).setColor(colors.approve)
                message.channel.send({ embeds: [iswhitelistedEmbed] })
                const newWhitelist = new whitelistSchema({ guildId: message.guild.id, memberId: member.id })
                newWhitelist.save()
                const listData = await antinukelistSchema.findOne({ guildId: message.guild.id });
                if (!listData) {
                    let item = {};
                    item.guildId = message.guild.id
                    item.guildData = [{
                        user: `**${member.user.tag}**`,
                        type: 'whitelist',
                        userId: `${member.id}`,
                        botstatus: `${isBot}`
                    },];
                    let newData = await antinukelistSchema.create(item);
                    newData.save();
                  } else if (listData) {
                    listData.guildData.push({
                        user: `**${member.user.tag}**`,
                        type: 'whitelist',
                        userId: `${member.id}`,
                        botstatus: `${isBot}`
                    });
                    await antinukelistSchema.findOneAndUpdate({
                      guildId: message.guild.id,
                    }, listData);
                  }
            } else if (whitelistData) {
                const iswhitelistedEmbed = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${member.user.tag}** is no longer whitelisted and will now trigger **antinuke** `).setColor(colors.approve)
                message.channel.send({ embeds: [iswhitelistedEmbed] })
                await whitelistSchema.findOneAndRemove({ guildId: message.guild.id, memberId: member.id })
                const listData = await antinukelistSchema.findOne({ guildId: message.guild.id });
                if (!listData) {
                    return message.channel.send(`:thumbsdown: no listdata`)
                  } else if (listData) {
                    await antinukelistSchema.updateOne({ guildId: message.guild.id, guildData: [{ userId: `${member.id}` }] }, { $pull: { userId: `${member.id}`, type: 'whitelist' }  });
                  }
            }
            // End of antinuke whitelist
        } else if (subCommand === 'list') {
            // Start of antinuke list
            const listData = await antinukelistSchema.findOne({ guildId: message.guild.id });
            if (!listData || listData.guildData.length < 0) return message.channel.send({ embeds: [new MessageEmbed({ description: `:mag_right: ${message.author}: No **antinuke modules** or **whitelisted members & bots** were found`, color: `#7189da`})] });
            const listOfEmbeds = [];
            let i = 0;
            let itemsCount = i;
            let pagedData = listData.guildData.pager(10);
            pagedData.forEach((page) => {
                let items = page.map((list) => { if (list.type === 'module') { return `\`${++i}\` **${list.module}** (do: ${list.punishment}, threshold: ${list.threshold})` } else if (list.type === 'whitelist') { return `\`${++i}\` **${list.user}** whitelisted (\`${list.userId}\`) [\`${list.botstatus}\`]`} else { return; }; }).join("\n")
                const listEmbed = new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setTitle(`Antinuke modules & whitelist`).setDescription(`${items}`).setColor(message.member.displayHexColor)
                listOfEmbeds.push(listEmbed);
            });
            if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, itemsCount); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
            // End of antinuke list
        }
    },
};
// End of antinuke module