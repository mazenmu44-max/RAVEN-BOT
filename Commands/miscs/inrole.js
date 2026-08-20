const pagination = require('../../Functions/reactionPagination');
const {
    MessageEmbed
} = require('discord.js');
const emojis = require('../../Data/emojis.json');
const colors = require('../../Data/colors.json');

module.exports = {
    name: 'members',
    aliases: ['inrole'],
    module: 'misc',
    description: 'list all members in the guild or in a role',
    run: async (client, message, args) => {
        const o = await message.guild.fetchOwner()
        if (!args[0]) {
            // Start of members function
            let listData = [];
            message.guild.members.cache.forEach(async (member) => {
                console.log(`${member.premiumSinceTimestamp}`)
                var boost = ''
                var bot = ''
                var owner = ''
                if (o.user.id === member.user.id) owner = `<:ownership:941942631167057991>`
                if (member.user.bot) bot = '<:bot:941936476495691796>'
                if (member.premiumSinceTimestamp !== null) boost = '<:serverboost:939652447062880327>'
                listData.push({
                    user: `[**${member.user.tag}**](https://discord.com/users/${member.user.id})`,
                    boost: `${boost}`,
                    bot: `${bot}`,
                    owner: `${owner}`
                });
            })
            if (!listData) return message.channel.send({
                embeds: [new MessageEmbed({
                    description: `:mag_right: ${message.author}: No **members** were found`,
                    color: `#7189da`
                })]
            });
            const listOfEmbeds = [];
            let i = 0;
            let pagedData = listData.pager(10);
            pagedData.forEach((page) => {
                let items = page.map((list) => {
                    var s = ''
                    ++i
                    if (i < 10) s = '0'
                    return `\`${s}${i}\` ${list.user} ${list.boost} ${list.bot} ${list.owner}`
                }).join("\n");
                const listEmbed = new MessageEmbed().setTitle(`**${message.guild.name}**'s members`).setDescription(`${items}`).setColor(colors.color)
                    .setFooter({
                        text: `Page 1/1 (${i} entries)`
                    })
                listOfEmbeds.push(listEmbed);
            });
            if (listOfEmbeds.length > 1) {
                await pagination(message, listOfEmbeds, pagedData.length, i, `${message.guild.memberCount} members ∙ `);
            } else {
                return message.channel.send({
                    embeds: [listOfEmbeds[0]]
                });
            }
            // End of members function
        } else if (args[0]) {
            if (!args[0]) return;
            if (args.includes("@everyone")) return;

            if (args.includes("@here")) return;

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            const noRole = new MessageEmbed()
                .setColor(`#faa61b`)
                .setDescription(`${emojis.warn} ${message.author}: I was **unable** to find the **role**: **${args.slice(0).join(" ")}**`)
            if (!role) return message.channel.send({
                embeds: [noRole]
            });

            let membersWithRole = [];
            message.guild.members.cache.filter(member => {
                return member.roles.cache.find(r => r.name === role.name);
            }).map(member => {
                membersWithRole.push({
                    user: `${member.user.tag}`
                })
            })

            if (!membersWithRole) return message.channel.send({
                embeds: [new MessageEmbed({
                    description: `:mag_right: ${message.author}: No **members** were found`,
                    color: `#7189da`
                })]
            });

            if (membersWithRole > 2048) return message.channel.send('list is too long')

            const listOfEmbeds = [];
            let i = 0;
            let pagedData = membersWithRole.pager(10);
            pagedData.forEach((page) => {
                let items = page.map((list) => {
                    return `\`${++i}\` **${list.user}**`
                }).join("\n");
                const listEmbed = new MessageEmbed()
                    .setAuthor({
                        name: `${message.member.displayName}`,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setTitle(`Members in '${role.name}'`)
                    .setDescription(`${items}`)
                    .setColor(message.member.displayHexColor)
                    .setFooter({
                        text: `Page 1/1 (${i} entries)`
                    })
                listOfEmbeds.push(listEmbed);
            });
            if (listOfEmbeds.length > 1) {
                await pagination(message, listOfEmbeds, pagedData.length, i);
            } else {
                return message.channel.send({
                    embeds: [listOfEmbeds[0]]
                });
            }
        }
    }
}