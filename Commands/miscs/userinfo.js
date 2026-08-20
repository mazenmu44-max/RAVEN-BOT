const config = require('../../Data/config.json');
const Discord = require('discord.js');
const emojis = require('../../Data/emojis.json');
const moment = require('moment');
const db = require('../../Models/lastfm')
const axios = require('axios')
let apiKey = "6245df282e7ba09748fb801fe27ad66d";
module.exports = {
    name: 'userinfo',
    aliases: ["ui", "whois", "info", "user"],
    description: 'View information about a user/member',
    footer: 'Page 1/1 (1 entry) ∙ Module: information',
    timeout: 2000,
    information: `:notes: User ID Available`,
    parameters: 'N/A',
    usage: `Syntax: userinfo <member>\nExample: userinfo ${config.ownertag}`,
    module: 'information',

    run: async (client, message, args) => {
        let mentionedMember = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(m => m.user.tag === args.join(" ")) || args[0] || message.member;

        try {
            const user = await client.users.fetch(client.users.resolveId(mentionedMember)).catch(() => null);
            //message.channel.send(`${user}`)
            const fetchedMembers = await message.guild.members.fetch();
            const joinPosition = fetchedMembers
                .sort((a, b) => a.joinedAt - b.joinedAt)
                .map((user) => user.id)
                .indexOf(user.id) + 1;

            let bot;
            let owner = await message.guild.fetchOwner()
            if (user.bot === true) {
                bot = "Discord Bot";
            } else if  (user.id === owner.user.id) {
                bot = 'Server Owner'
            } else if (mentionedMember.guild && mentionedMember.permissions.has('ADMINISTRATOR')) {
                bot = 'Server Administrator'
            } else {
                bot = "N/A";
            }
            if (user.id == message.guild.ownerId) {
                guildOwner = "Server Owner";
            } else {
                guildOwner = "";
            }

            let nickname = mentionedMember.nickname
            if (nickname) {
                nickname = `${mentionedMember.nickname}`
            } else {
                nickname = ''
            }

            const serverflags = {
                DISCORD_EMPLOYEE: ` ${emojis.discordStaff}`,
                DISCORD_PARTNER: ` ${emojis.discordPartner}`,
                HYPESQUAD_EVENTS: ` ${emojis.hypeSquad}`,
                BUGHUNTER_LEVEL_1: ` ${emojis.bugHunter}`,
                HOUSE_BRAVERY: ` ${emojis.hypeSquadBravery}`,
                HOUSE_BRILLIANCE: ` ${emojis.hypeSquadBril}`,
                HOUSE_BALANCE: ` ${emojis.hypeSquadBal}`,
                EARLY_SUPPORTER: ` ${emojis.earlySupporter}`,
                BUGHUNTER_LEVEL_2: ` ${emojis.bugHunterPlus}`,
                VERIFIED_BOT: ` ${emojis.verifiedBot}`,
                VERIFIED_DEVELOPER: ` ${emojis.verifiedBotDev}`,
                CERTIFIED_MODERATOR: ` ${emojis.certifiedModerator}`
            };
            let nitroBadge = user.displayAvatarURL({
                format: "png",
                dynamic: true,
                size: 2048
            })
            let userFlags = Message.author.fetchFlags().toArray().map(Flag => Client.Badges[Flag]).join(' ')
            let dd = user.fetchFlags.length ? userFlags.map(flag => serverflags[flag]).join(' ') : ''

            /*let userFlags = ''
            if (userFlags) {
              userFlags = `∙ ${userFlags.length ? userFlags.map(serverflags => serverflags[serverflags]).join(' ') : ' '}`;
            } else {
              userFlags = ''
            }*/

            if (nitroBadge.includes("gif")) {
                userFlags = userFlags + ` ${emojis.nitro}`
            }
            if (!userFlags || userFlags == false || null) {
                userFlags = ""
            }

            let boosterBadge = mentionedMember.premiumSince
            if (boosterBadge == null) {
                boosterBadge = ''
            } else {
                boosterBadge = ` ${emojis.nitro} ${emojis.booster}`
            }

            let JoinedAt = '';
            let lastmessage = mentionedMember.joinedAt;
            if (lastmessage == null) {
                JoinedAt = ''
            } else {
                JoinedAt = `**Joined**: ${moment(mentionedMember.joinedAt).format("DD/MM/YYYY, h:mm A")} (<t:${Math.floor(mentionedMember.joinedTimestamp / 1000)}:R>)`
            }

            let JoinPos = '';
            let lastmessage2 = mentionedMember.joinedAt;
            if (lastmessage2 == null) {
                JoinPos = 'N/A'
            } else {
                JoinPos = `${joinPosition}`
            }

            let BoostedAt = '';
            let lastmessage3 = mentionedMember.premiumSince;
            if (lastmessage3 == null) {
                BoostedAt = ''
            } else {
                BoostedAt = `**Boosted**: ${moment(mentionedMember.premiumSince).format("DD/MM/YYYY, h:mm A")} (<t:${Math.floor(mentionedMember.premiumSinceTimestamp / 1000)}:R>)`
            }

            //let amir = "";
            //if (user.id === "917210373051011142") amir = " :tools: <:mike:930206702899449886> <:AdventurousBilly:931240863739306094> <:BlouHotdog:931240918374293545> <a:DaConvertible:931242504932704326> <:jitulyin:930994793448882236> <a:819063375707111424:931240833431273494> <:0joobiblueThumbs:931241091800371280>";

            //let mar = "";
            //if (user.id === "917210373051011142") mar = " :tools: <:zscap:931275651263123486>";

            //let evan = "";
            //if (user.id === "917210373051011142") evan = " :tools: <a:Taliban:934510567119523871> <a:IFYKYK:934510619464445972> <a:YB:934510662925832242>";
            const array = []; await client.guilds.cache.filter(guild => guild.members.cache.get(user.id)).map((guild) => { array.push(`[**${guild.name}**](https://discord.com/channels/${guild.id}/${guild.rulesChannelId || 'N/A'}) (${guild.id})`) })

            if (user) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor({
                            name: `${user.tag} (${user.id})`,
                            iconURL: user.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTitle(`${user.tag}${nickname}${boosterBadge}`)
                        .setColor(mentionedMember.displayHexColor || config.color)
                        .setThumbnail(user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 2048
                        }))
                        .addField('**Dates**', `**Created**: ${moment(user.createdAt).format("DD/MM/YYYY, h:mm A")} (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)\n${JoinedAt}\n${BoostedAt}`, false)
                        .setFooter({
                            text: `${user.id === '917210373051011142' ? 'hollow admin' : bot} ∙ Join position: ${JoinPos} ∙ ${array.length} server(s)`
                        })
                        console.log(array)
                        array.length > 0 ? embed.addField(`**Mutual Servers**`, `${array.join('\n')}`) : null
                    mentionedMember.guild ? mentionedMember.roles ? embed.addField(`**Roles (${mentionedMember.roles.cache.filter(role => role.toString() !== "@everyone").size})**`, `${mentionedMember.roles.cache
                        .sort((a, b) => b.position - a.position)
                        .filter(role => role.toString() !== "@everyone")
                        .map(role => role.toString())
                        .join(", ")}`) : null : null
                    return message.channel.send({
                        embeds: [embed]
                    })
            } else {
                if (user) user = message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: `${emojis.warn} ${message.author}: I was unable to find that **member** or the **ID** is invalid`,
                        color: `#faa61b`
                    })]
                });
            }
        } catch (e) {
            console.log(e)
            await message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: `${emojis.warn} ${message.author}: I was unable to find that **member** or the **ID** is invalid`,
                    color: `#faa61b`
                })]
            });
        }
    }
}