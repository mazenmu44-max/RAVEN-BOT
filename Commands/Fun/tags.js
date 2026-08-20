const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')

module.exports = {
    name : 'tags',
    aliases : ['tag', 't'],
    parameters : ['tag_name'],
    usage : 'Syntax: tag (tag name)\nExample: tag a_tag_name',
    commands : [
        {
            name : 'tags list',
            description : 'View a list of every tag in guild',
            parameters : ['member'],
            usage : 'Syntax: tag list'
        },
        {
            name : 'tags author',
            description : 'View the author of a tag',
            aliases : ['owner', 'creator'],
            parameters : ['tag_name'],
            usage : 'Syntax: tag author (tag name)\nExample: tag author nick'
        },
        {
            name : 'tags remove',
            description : 'Remove a tag from guild',
            aliases : ['del', 'delete'],
            parameters : ['tag_name'],
            usage : 'Syntax: tag remove (tag name)\nExample: tag remove nick goat'
        },
        {
            name : 'tags edit',
            description : 'Edit the contents of your tag',
            aliases : ['change', 'update'],
            parameters : ['tag_name', 'new_context'],
            usage : 'Syntax: tag edit (tag name) (new context)\nExample: tag edit nick THE goat'
        },
        {
            name : 'tags reset',
            description : 'Reset every tag for this guild',
            permissions : ['MANAGE_GUILD'],
            information : `${emojis.warn} Manage Guild`,
            usage : 'Syntax: tags reset'
        },
        {
            name : 'tags search',
            description : 'Search for tags containing a keyword',
            aliases : ['look'],
            parameters : ['search'],
            information : ':notepad_spiral: Query is limited to 10 characters',
            usage : 'Syntax: tag search (query)\nExample: tag search nick'
        },
        {
            name : 'tags add',
            description : 'Add a tag to guild',
            aliases : ['create'],
            parameters : ['tag_name', 'yea'],
            usage : 'Syntax: tag add (tag name) (context)\nExample: tag add nick goat'
        },
        {
            name : 'tags random',
            description : 'Return a random tag',
            usage : 'Syntax: tag random'
        },
        {
            name : 'tags rename',
            description : 'Rename your tags name',
            aliases : ['editname'],
            parameters : ['tag_name', 'new_name'],
            usage : 'Syntax: tag rename (tag name) (new name)\nExample: tag remove nick thenick'
        }
    ],
    module : 'fun',
    run : async (client, message, args, prefix) => {
        const commands = ['list', 'author', 'owner', 'creator', 'remove', 'del', 'delete', 'edit', 'change', 'update', 'reset', 'search', 'look', 'add', 'create', 'random', 'rename', 'editname']
        if (!args[0]) return await new client.help(message, prefix).send('tags', '', 'tag (tag name)', 'tag a_tag_name')
        if (!commands.includes(args[0])) {
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) return await new client.warning(message).send(`No existing tag found for **${args[0]}**`)
                data = data.tags.filter(tag => tag.name === args[0])
                if (data.length === 0) return await new client.warning(message).send(`No existing tag found for **${args[0]}**`)
                message.channel.send(`${data[0].context}`)
            })
        } if (args[0] === 'list') {
            await client.db.tags.findOne({ guild : message.guild.id }).then(async(data) => {
                if (!data || data.tags.length === 0) return await new client.warning(message).send(`No **tags** were found`)
                const embeds = []; let tagIndex = 0;
                const tags = data.tags.pager(10);
                tags.forEach((page) => {
                    const list = page.map((item) => { return `\`${++tagIndex}\` ${item.name} ${item.author === message.author.id ? '(your tag)' : ''}`}).join("\n");
                    embeds.push(new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) }).setTitle('Tags created').setColor(message.member.displayHexColor).setDescription(list).setFooter({ text : `Page 1/1 (${tagIndex} ${tagIndex === 1 ? 'entry' : 'entries'})` }));
                });
                if (embeds.length > 1) { await new client.pagination(message, embeds, tags.length, tagIndex).send(); } else { return message.channel.send({ embeds: [embeds[0]] });}
            })
        } else if (args[0] === 'author' || args[0] === 'owner' || args[0] === 'creator') {
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) return await new client.warning(message).send(`No existing tag found for **${args[1]}**`)
                data = data.tags.filter(tag => tag.name === args[1])
                if (data.length === 0) return await new client.warning(message).send(`No existing tag found for **${args[1]}**`)
                const author = await client.users.cache.get(data[0].author).tag
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`:information_source: ${message.author}: Tag **${args[1]}** author is \`${author}\``).setColor(colors.raven)] })
            })
        } else if (args[0] === 'remove' || args[0] === 'del' || args[0] === 'delete') {
            const tag_name = args[1]; if (!tag_name) return await new client.help(message, prefix).send('tags remove', 'Remove a tag from guild', 'tag remove (tag name)', 'tag remove nick goat')
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) return await new client.warning(message).send(`No existing tag found for **${args[1]}**`)
                const check = []; await data.tags.map(async(item) => { check.push(item.name) })
                if (!check.includes(tag_name)) return await new client.warning(message).send(`No existing tag found for **${args[1]}**`)
                data.tags = data.tags.filter(item => item.name !== tag_name) 
                await client.db.tags.findOneAndUpdate({ guild: message.guild.id }, data);
                return await new client.success(message).send(`Success, deleted tag \`${tag_name}\``)
            })
        } else if (args[0] === 'edit' || args[0] === 'change' || args[0] === 'update') {

        } else if (args[0] === 'reset') {
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) return await new client.warning(message).send('There are no **tags** to delete!')
                const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} Are you sure that you would like to **delete** \`${data.tags.length}\` tags?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
                const filter = async (i) => { await i.deferUpdate(); if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }; return i.user.id == message.author.id; };
                const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
                collector.on("collect", async (interaction) => {
                    if (interaction.customId === 'approve') {
                        await client.db.tags.findOneAndDelete({ guild : message.guild.id }); msg.delete()
                        await new client.success(message).send(`Removed \`${data.tags.length}\` **tags** from this server`)
                        collector.stop()
                    } else if (interaction.customId === 'decline') {
                        msg.delete()
                        collector.stop()
                    }
                })
            })
        } else if (args[0] === 'search' || args[0] === 'look') {

        } else if (args[0] === 'add' || args[0] === 'create') {
            const tag_name = args[1]; if (!tag_name) return await new client.help(message, prefix).send('tags add', 'Add a tag to guild', 'tag add (tag name) (context)', 'tag add nick goat')
            const tag_context = args.slice(2).join(' '); if (!tag_context) return await new client.warning(message).send('Missing context for tag')
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) {
                    new client.db.tags({ guild : message.guild.id, tags : [{ name : tag_name, context : tag_context, author : message.author.id }] }).save();
                    return await new client.success(message).send(`Cool. Created tag \`${tag_name}\``)
                } else {
                    const check = []; await data.tags.map(async(item) => { check.push(item.name) });
                    if (check.includes(tag_name)) return await new client.warning(message).send('That tag already exists, you can\'t rewrite it')
                    data.tags.push({ name : tag_name, context : tag_context, author : message.author.id });
                    await client.db.tags.findOneAndUpdate({ guild: message.guild.id }, data);
                    return await new client.success(message).send(`Cool. Created tag \`${tag_name}\``)
                }
            })
        } else if (args[0] === 'random') {
            await client.db.tags.findOne({ guild : message.guild.id }).then(async (data) => {
                if (!data) return await new client.warning(message).send(`No **tags** were found`)
                const random = Math.floor(Math.random() * data.tags.length); message.channel.send(`${data.tags[random].context}`)
            })
        } else if (args[0] === 'rename' || args[0] === 'editname') {

        }
    },
};