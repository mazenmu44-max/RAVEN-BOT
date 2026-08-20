const {
    MessageEmbed
} = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const createdembedsSchema = require('../../Models/test/ce')
const paginationSchema = require('../../Models/Servers/pagination')

module.exports = {
    name: 'pagination',
    description: 'Set up multiple embeds on one message',
    aliases: ['pn', 'pages'],
    permissions: ['MANAGE_MESSAGES'],
    information: `${emojis.warn} Manage Messages`,
    usage: 'Syntax: pagination (subcommand) <args>',
    module: 'servers',
    pages: [{
            name: 'pagination list',
            description: 'View all existing pagination embeds',
            information: `${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination list',
        },
        {
            name: 'pagination add',
            description: 'Add a page to a pagination embed',
            parameters: 'messagelink, arg',
            information: `${emojis.cooldown} 5 seconds\n${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination add (message link) <embed code>\nExample: pagination add discordapp.com/channels/... {"title":',
        },
        {
            name: 'pagination update',
            description: 'Update an existing page on pagination embed',
            parameters: 'messagelink, idd, arg',
            information: `${emojis.cooldown} 5 seconds\n${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination update (message link) <page id> <embed code>\nExample: pagination update discordapp.com/channels/... 3 {}'
        },
        {
            name: 'pagination set',
            description: 'Set up an existing embed to be paginated',
            parameters: 'messagelink',
            information: `${emojis.cooldown} 5 seconds\n${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination set (message link)\nExample: pagination set discordapp.com/channels/...'
        },
        {
            name: 'pagination reset',
            description: 'Remove every existing pagination in guild',
            aliases: ['clear'],
            information: `${emojis.warn} Administrator`,
            usage: `Syntax: pagination reset`
        },
        {
            name: 'pagination remove',
            description: 'Remove a page from a pagination embed',
            parameters: 'messagelink, idd',
            information: `${emojis.cooldown} 5 seconds\n${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination remove (message link) <id>\nExample: pagination remove discordapp.com/channels/... 3'
        },
        {
            name: 'pagination delete',
            description: 'Delete a pagination embed entirely',
            parameters: 'messagelink',
            information: `${emojis.cooldown} 5 seconds\n${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination delete (message link)\nExample: pagination delete discordapp.com/channels/...'
        },
        {
            name: 'pagination restorereactions',
            description: 'Restore reactions to an existing pagination',
            aliases: ['rr'],
            parameters: 'messagelink',
            information: `${emojis.warn} Manage Messages`,
            usage: 'Syntax: pagination restorereactions (message link)\nExample: pagination restorereactions discordapp.com/channels/...'
        }
    ],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Pagination
     */

    run: async (client, message, args, prefix) => {
        const commands = ['list', 'add', 'update', 'set', 'reset', 'clear', 'remove', 'restorereactions', 'rr']
        const pagination = await client.commands.get('pagination')
        const command = args[0]
        try {
            const helpPagination = new MessageEmbed().setAuthor({
                name: `raven help`,
                iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png'
            }).setTitle(`Command: ${pagination.name}`).setDescription(`${pagination.description}\`\`\`${pagination.usage}\`\`\``).setColor('#718090')
            if (!command || !commands.includes(command)) return message.channel.send({
                embeds: [helpPagination]
            })
            if (command === 'list') {
                const paginationData = await paginationSchema.find({
                    guildId: message.guild.id
                })
                if (!paginationData || paginationData.length === 0) return message.channel.send({
                    embeds: [new MessageEmbed({
                        description: `:mag_right: ${message.author}: No **pagination embeds** were found`,
                        color: `#7189da`
                    })]
                });

                let paginations = [];
                let paginationIndex = 0;
                for (const pn of paginationData) {
                    paginations.push({
                        id: pn.id,
                        link: pn.link,
                        author: pn.author,
                        pages: pn.pages
                    });
                }
                let pages = paginations.pager(10);

                const paginationPages = [];
                for (const page of pages) {
                    const paginationsMapped = page.map((pn) => {
                        return `\`${++paginationIndex}\` [${pn.id}](${pn.link}) - ${pn.author} (\`${pn.pages}\`)`
                    }).join("\n");
                    const push = new MessageEmbed().setAuthor({
                        name: `${message.member.displayName}`,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    }).setTitle(`Pagination embeds`).setDescription(`${paginationsMapped}`).setColor(message.member.displayHexColor).setFooter({
                        text: `Page 1/1 (${boosterroleIndex} ${boosterroleIndex === 1 ? 'entry' : 'entries'})`
                    })
                    paginationPages.push(push);
                };

                if (paginationPages.length > 1) {
                    await pagination(message, paginationPages, pages.length, paginationIndex);
                } else {
                    return message.channel.send({
                        embeds: [paginationPages[0]]
                    });
                }
            } else if (command === 'add') {
                const messageLink = args[1]
                if (!messageLink) return;

                message.guild.channels.cache.forEach(async (fetchedChannel) => {
                    if (fetchedChannel.type === 'GUILD_TEXT') {
                        const fetchedMessages = await fetchedChannel.messages.fetch({
                            limit: 100
                        })
                        fetchedMessages.forEach(async (msg) => {
                            if (msg.url === messageLink) {
                                const data = await paginationSchema.findOne({ message : msg.id })
                                if (!data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: This embed is not set up for **pagination** - you can set it by using \`${prefix}pagination set ${messageLink}\``).setColor(colors.warn)] })
                                const code = args.slice(2).join(' ')
                                if (!code) return;
                                try {
                                    let json = await JSON.parse(code)
                                    if ({}.hasOwnProperty.call(json, "thumbnail")) { json.thumbnail = { url: json.thumbnail }; }
                                    if ({}.hasOwnProperty.call(json, "image")) { json.image = { url: json.image }; }
                                    if ({}.hasOwnProperty.call(json, "footer")) { json.footer = { text: json.footer.text, icon_url: json.footer.icon_url }; }
                                    message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Added **Page ${data.pages.length + 1}** to [\`${msg.id}\`](${messageLink})`) .setColor(colors.approve)] })
                                    msg.edit({embeds : [msg.embeds[0].setFooter({ text : `Page 1 of ${data.pages.length + 1}`})]})
                                    data.pages.push({ embed : json });
                                    await paginationSchema.findOneAndUpdate({ message: msg.id }, data);           
                                } catch (e) {
                                    return console.log(e)
                                }
                            }
                        })
                    }
                })
            } else if (command === 'update') {

            } else if (command === 'set') {

                const messageLink = args[1]
                if (!messageLink) return;

                message.guild.channels.cache.forEach(async (fetchedChannel) => {
                    if (fetchedChannel.type === 'GUILD_TEXT') {
                        const fetchedMessages = await fetchedChannel.messages.fetch({
                            limit: 100
                        })
                        fetchedMessages.forEach(async (msg) => {
                            if (msg.url === messageLink) {
                                const embed1 = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set [\`${msg.id}\`](${messageLink}) as a **pagination embed**`) .setColor(colors.approve)
                                const embed2 = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't set up this embed for pagination due to it not being a **custom embed** message. Recreate it using \`,embedcode\` then using \`,createembed\``).setColor(colors.deny)
                                const embed3 = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: This embed is already set up as a **pagination embed**`).setColor(colors.warn)

                                const embedData = await createdembedsSchema.findOne({ messageId: msg.id })
                                if (!embedData) return message.channel.send({ embeds : [embed2] })

                                const paginationData = await paginationSchema.findOne({ message : msg.id })
                                if (paginationData) return message.channel.send({ embeds : [embed3] })
                                
                                msg.edit({ embeds : [msg.embeds[0].setFooter({ text : `Page 1 of 1` })] })

                                msg.reactions.removeAll()
                                msg.react('⬅️')
                                msg.react('➡️')

                                let item = {};
                    item.message = msg.id, item.pages = [{ embed : msg.embeds[0] },];
                    new paginationSchema(item).save();
                                message.channel.send({ embeds : [embed1] })
                            }
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
            let token = '';
            const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 60; i++) token += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **pagination**. Try again later.`).setColor(colors.warn).setFooter({
                text: `${token}`
            })
            return message.channel.send({
                embeds: [errorEmbed]
            })
        }
    },
};