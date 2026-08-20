const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const autoroles = require('../../Models/Autorole/autoroles.js')
module.exports = {
    name : 'autorole',
    description : 'Set up automatic role assign on member join',
    aliases : ['ar'],
    permissions : ['MANAGE_GUILD'],
    information : `${emojis.warn} Manage Guild`,
    usage : 'Syntax: autorole (subcommand) <args>\nExample: autorole add (role)',
    module : 'autorole',
    pages : [
        {
            name : 'autorole list',
            description : 'View a list of every autorole',
            aliases : ['all'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: autorole list'
        },
        {
            name : 'autorole remove',
            description : 'Removes a autorole and stops assigning on join',
            aliases : ['delete', 'del'],
            parameters : 'role',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: autorole remove (role)\nExample: autorole remove Member'
        },
        {
            name : 'autorole reset',
            description : 'Clears every autorole for guild',
            aliases : ['clear'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: autorole reset'
        },
        {
            name : 'autorole add',
            description : 'Adds a autorole and assigns on join to member',
            aliases : ['create'],
            parameters : 'role',
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: autorole add (role)\nExample: autorole add Member'
        }
    ],
    run : async (client, message, args, prefix) => {
        const commands = ['list', 'all', 'remove', 'delete', 'del', 'reset', 'clear', 'add', 'create']
        try {
            if (!args[0] || !commands.includes(args[0])) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: autorole').setDescription(`Set up automatic role assign on member join\`\`\`Syntax: autorole (subcommand) <args>\nExample: autorole add (role)\`\`\``).setColor('#718090')] })

            if (args[0] === 'list' || args[0] === 'all') {
                const ar = await autoroles.findOne({ guild: message.guild.id });
                if (!ar || ar.autoroles.length === 0) return message.channel.send({ embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **autoroles** found for this guild`).setColor(colors.warn)] });
                const autorolePages = [];
                let autoroleIndex = 0;
                const autorolePager = ar.autoroles.pager(10);
                autorolePager.forEach((page) => {
                    const items = page.map((autorole) => { return `\`${++autoroleIndex}\` ${message.guild.roles.cache.get(autorole.role) ? message.guild.roles.cache.get(autorole.role).name : 'N/A'} \`(${autorole.role})\``; }).join('\n');
                    autorolePages.push(new MessageEmbed().setAuthor({ name : message.member.displayName, iconURL : message.author.displayAvatarURL({ dynamic: true }) }).setTitle('Auto roles for this guild').setColor(message.member.displayHexColor).setDescription(items).setFooter({ text : `Page 1/1 (${autoroleIndex === 1 ? 'entry' : 'entries'})` }))
                });
                if (autorolePages.length > 1) { await pagination(message, autorolePages, autorolePager.length, autoroleIndex, ` (${autoroleIndex} ${autoroleIndex === 1 ? 'entry' : 'entries'})`); } else { return message.channel.send({ embeds: [autorolePages[0]] }); }
            } else if (args[0] === 'remove' || args[0] === 'delete' || args[0] === 'del') {
                if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: autorole remove').setDescription(`Removes a autorole and stops assigning on join\`\`\`Syntax: autorole remove (role)\nExample: autorole remove Member\`\`\``).setColor('#718090')] })
                const role = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first() || message.guild.roles.cache.find((r) => r.name.startsWith(args.slice(1).join(' ')))
                if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args.slice(1).join(' ')}**`).setColor(colors.warn)] })
                const autoroleData = await autoroles.findOne({ guild : message.guild.id, autoroles : [{ role : role.id }] })
                if (!autoroleData) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: **${role.name}** isn't an autorole in this guild`).setColor(colors.deny)] })
                await autoroles.findOneAndRemove({ guild : message.guild.id, autoroles : [{ role : role.id }] }).then(() => { message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${role.name}** will no longer be assigned to members who join`).setColor(colors.approve)] })})
            } else if (args[0] === 'reset' || args[0] === 'clear') {
                const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Are you sure that you want to reset **ALL** auto roles?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
                const filter = async (i) => { 
                    await i.deferUpdate();
                    if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
                    return i.user.id == message.author.id;
                };
                const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
                collector.on("collect", async (interaction) => {
                    if (interaction.customId === 'approve') {
                        await autoroles.findOneAndDelete({ guild : message.guild.id })
                        msg.delete()
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Success, reset the autoroles and will no longer assign roles on join`).setColor(colors.approve)] })
                        collector.stop()
                    } else if (interaction.customId === 'decline') {
                        message.delete()
                        msg.delete()
                        collector.stop()
                    }
                })
            } else if (args[0] === 'add' || args[0] === 'create') {
                if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://raven.bot/img/bot_avatar_default.png' }).setTitle('Command: autorole add').setDescription(`Adds a autorole and assigns on join to member\`\`\`Syntax: autorole add (role)\nExample: autorole add Member\`\`\``).setColor('#718090')] })
                const role = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first() || message.guild.roles.cache.find((r) => r.name.startsWith(args.slice(1).join(' ')))
                if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args.slice(1).join(' ')}**`).setColor(colors.warn)] })
                const autoroleData = await autoroles.findOne({ guild : message.guild.id, autoroles : [{ role : role.id }] })
                if (autoroleData) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: **${role.name}** is already an autorole`).setColor(colors.deny)] })
                const check = await autoroles.findOne({ guild : message.guild.id });
                if (role.position > message.guild.members.cache.get(client.user.id).roles.highest.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No permissions. That role is **above** my bot role on the hierarchy`).setColor(colors.warn)] })
                if (!check) {
                    let item = {};
                    item.guild = message.guild.id, item.autoroles = [{ role : role.id },];
                    new autoroles(item).save();
                } else {
                    check.autoroles.push({ role : role.id });
                    await autoroles.findOneAndUpdate({ guild: message.guild.id }, check);
                }
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **${role.name}** will now be assigned to members who join`).setColor(colors.approve)] })
            }
        } catch (error) {
            return console.log(error)
        }
    },
};