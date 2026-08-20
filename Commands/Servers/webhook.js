const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'webhook', description : 'Set up webhooks in your server',
    permissions : ['MANAGE_WEBHOOKS'], information : { permissions : 'Manage Webhooks' },
    usage : { syntax : 'webhook (subcommand) <args>', example : 'webhook create daddyhook' },
    commands : [{
            name : 'webhook create', description : 'Create webhook to forward messages to',
            parameters : ['name'], information : { permissions : 'Manage Webhooks' },
            usage : { syntax : 'webhook create (name)', example : 'webhook create daddyhook' }
        }, {
            name : 'webhook send', description : 'Send message to existing channel webhook',
            aliases : ['message'], parameters : ['identifier', 'arg'], 
            information : { permissions : 'Manage Webhooks' },
            usage : { syntax : 'webhook send (identifier) <message or embed code> [--add <embed code>]', example : 'webhook send mn7dlp4 hello world' },
        }, {
            name : 'webhook edit', description : 'Send message to existing channel webhook',
            aliases : ['editmessage'], parameters : ['messagelink', 'arg'],
            information : { permissions : 'Manage Webhooks' },
            usage : { syntax : 'webhook edit (message link) <message or embed code> [--add <embed code>]', example : 'webhook edit discord.com/.../ hello world' }
        }, {
            name : 'webhook list', description : 'List all available webhooks in the server', usage : { syntax : 'webhook list' }
        }, {
            name : 'webhook delete', description : 'Delete webhook for a channel',
            aliases : ['remove', 'del'], parameters : ['identifier'], 
            information : { permissions : 'Manage Webhooks' },
            usage : { syntax : 'webhook delete (identifier)', example : 'webhook delete mn7dlp4' }
        }], module : 'servers',
    run : async (client, message, args, prefix) => {
        const commands = ['create', 'send', 'message', 'edit', 'editmessage', 'list', 'delete', 'remove', 'del']
        if (!args[0] || !commands.includes(args[0])) return await new client.help(message, prefix).send('webhook', 'Set up webhooks in your server', 'webhook (subcommand) <args>', 'webhook create daddyhook')
        
        if (args[0] === 'create') {
            if (args[0] && args.slice(1).join(' ').length < 2 || args[0] && args.slice(1).join(' ').length > 32) return await new client.warning(message).send('Webhook **names** must be a minimum of **2** characters and a maximum of **32** characters')
            const webhook = await message.channel.createWebhook(args[1] ? args.slice(1).join(' ') : message.guild.name, { reason : `webhook create: new generated webhook by ${message.author.tag}` }); const id = identifier()
            await client.db.webhooks.findOne({ guild : message.guild.id }).then(async (data) => {
                if (data) {
                    data.webhooks.push({ identifier : id, webhook : webhook.id, author : message.author.id, channel : message.channel.id });
                    await client.db.webhooks.findOneAndUpdate({ guild: message.guild.id }, data); 
                } else {
                    new client.db.webhooks({ guild : message.guild.id, webhooks : [{ identifier : id, webhook : webhook.id, author : message.author.id, channel : message.channel.id }] }).save()
                }
                return await new client.search(message).send(`A new webhook with identifier \`${id}\` was created for ${message.channel}.`)
            })
        } else if (args[0] === 'send' || args[0] === 'message') {
            const id = args[1]; const content = args.slice(2).join(' '); 

            if (!id || !content) return await new client.warning(message).send('Missing **code** to create webhook')

            await client.db.webhooks.findOne({ guild : message.guild.id }).then(async (data) => {

                if (!data) return await new client.search(message).send(`No **webhook** found matching identifier \`${id}\``)

                const array = []; data.webhooks.map((webhook) => webhook.identifier == id ? array.push({ webhook : webhook.webhook, identifier : webhook.identifier }) : null); 
                if (array.length === 0) return await new client.search(message).send(`No **webhook** found matching identifier \`${id}\``)
                
                const webhook = await client.fetchWebhook(array[0].webhook);

                if (content.startsWith('{embed}')) {
                    embed(content, webhook)
                } else {
                    webhook.send(content.toString())
                }
            })
        } else if (args[0] === 'edit' || args[0] === 'editmessage') {
            const message_link = args[1]; if (!message_link) return await new client.help(message, prefix).send('webhook edit', 'Send message to existing channel webhook', 'webhook edit (message link) <message or embed code> [--add <embed code>]', 'webhook edit discord.com/.../ hello world')
            if (!message_link.startsWith('https://discord.com/channels/') && !message_link.startsWith('https://canary.discord.com/channels/')) return await new client.warning(message).send('Invalid **message link** passed')
            const ids = []; for (let string of String(message_link).replace('https:', '').replace('discord.com', '').replace('canary.discord.com', '').replace('channels', '').split('/')) { if (string.length > 0) ids.push(string) }
            if (isNaN(ids[0]) || isNaN(ids[1]) || isNaN(ids[2]) || ids[0] && ids[1] && !ids[2] || ids[0] && !ids[1] && !ids[2]) return await new client.warning(message).send('Invalid formatting for integer')
            try { await message.channel.messages.fetch(ids[2]) } catch (error) { return await new client.warning(message).send(`Couldn't fetch that message. Probably **deleted message** or **invalid ID**`) }
            const msg = await message.channel.messages.fetch(ids[2]); console.log(msg.author)
        }
    }
}
function identifier () { var identifierText = ''; var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < 7; i++) identifierText += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)); return identifierText; };

function embed (content, webhook) {
    let msg = ''; const arrayOfEmbeds = []
    for (let add of content.split('--add').values()) {
        console.log(add)
        add = add.replace('--add', '')
        const embed = new MessageEmbed();
        for (let str of add.split('{').values()) {
            console.log(str)
            if (str.startsWith('title:')) {
                str = str.toString().replace('title:', '').replace('$v', '').replace('}', '').trim()
                embed.setTitle(`${str}`)
            } else if (str.startsWith('description:')) {
                str = str.toString().replace('description:', '').replace('$v', '').replace('}', '').trim()
                embed.setDescription(`${str}`)
            } else if (str.startsWith('field:')) {
                let field = str.replace('field:', '').replace('$v', '').replace('}', '').split('&&')
                embed.addField(`${field[0].toString().trim()}`, `${field[1].toString().trim()}`, field[2] ? field[2].toString().trim() === 'true' ? true : false : null)
            } else if (str.startsWith('author:')) {
                let author = str.replace('author:', '').replace('$v', '').replace('}', '').split('&&')
                embed.setAuthor({ name : `${author[0]}`, iconURL : author[1] ? author[1] : null, url : author[2] ? author[2] : null })
            } else if (str.startsWith('footer:')) {
                let footer = str.replace('footer:', '').replace('$v', '').replace('}', '').split('&&')
                embed.setFooter({ text : `${footer[0]}`, iconURL : footer[1] ? footer[1] : null })
            } else if (str.startsWith('thumbnail:')) {
                str = str.toString().replace('thumbnail:', '').replace('$v', '').replace('}', '').trim()
                embed.setThumbnail(`${str}`)
            } else if (str.startsWith('image:')) {
                str = str.toString().replace('image:', '').replace('$v', '').replace('}', '').trim()
                embed.setImage(`${str}`)
            } else if (str.startsWith('color:')) {
                str = str.toString().replace('color:', '').replace('$v', '').replace('}', '').trim()
                embed.setColor(`${str}`)
            } else if (str.startsWith('timestamp')) {
                embed.setTimestamp()
            } else if (str.startsWith('url:')) {
                str = str.toString().replace('url:', '').replace('$v', '').replace('}', '').trim()
                embed.setURL(`${str}`)
            } else if (str.startsWith('message:')) {
                str = str.toString().replace('message:', '').replace('$v', '').replace('}', '').trim()
                msg = str
            }
        }
        arrayOfEmbeds.push(embed)
    }
    setTimeout(() => {
        webhook.send({ embeds : arrayOfEmbeds, content : msg.length > 0 ? msg : null })
    }, 1000)
}