module.exports = {
    name : 'reactionrole',
    description : 'Set up self-assignable roles with reactions',
    aliases : ['rr'],
    permissions : ['MANAGE_GUILD'],
    information : { permissions : `Manage Guild` },
    usage : { syntax : 'reactionrole (subcommand) <args>' },
    commands : [
        {

        }
    ],
    module : 'autorole',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Reactionrole
    */

    run : async (client, message, args, prefix) => {
        if (args[0] && args[0] === 'add') {
            const message_link = args[1]; 
            if (!message_link) return await new client.help(message, prefix).send('reactionrole add', 'Adds a reaction role to a message', 'reactionrole add (message link) <reaction> <role>', 'reactionrole add .../channels/... 🌟 @role')
            const reaction = args[2]; 
            if (!reaction) return await new client.warning(message).send('Missing **reaction emoji** to add to message'); if (!message_link.startsWith('https://discord.com/channels/') && !message_link.startsWith('https://canary.discord.com/channels/')) return await new client.warning(message).send('Invalid **message link** or **IDs** provided')
            
            const ids = []; 
            for (let string of String(message_link)
            .replace('https:', '')
            .replace('discord.com', '')
            .replace('canary.discord.com', '')
            .replace('channels', '').split('/')) { 
                if (string.length > 0) 
                ids.push(string) 
            }
            if (isNaN(ids[0]) || isNaN(ids[1]) || isNaN(ids[2]) || ids[0] && ids[1] && !ids[2] || ids[0] && !ids[1] && !ids[2]) 
            return await new client.warning(message).send('Invalid formatting for integer')
            
            const channel = message.guild.channels.cache.get(ids[1]); 
            if (!channel) return await new client.warning(message).send(`I was unable to find a channel with the ID: **${ids[1]}**`)
            
            try { 
                await channel.messages.fetch(ids[2]) 
            } catch (error) { 
                return await new client.warning(message).send(`Couldn't fetch that message. Probably **deleted message** or **invalid ID**`) 
            }
            const msg = await channel.messages.fetch(ids[2]); try { 
                await msg.react(reaction) 
            } catch (error) { return await new client.warning(message).send('I\'m not in a guild with that emote. Try using a emote from this guild instead') }

        }
    },
};