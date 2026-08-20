const glob = require("glob");
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
module.exports = {
    name: "reload",
    aliases: ['r', 'rl'],
    staffonly: true,
    cooldowns: 10000,
    run: async (client, message, args) => {
        if (message.author.id !== '944099356678717500') return;
        const commandsSize = client.commands.size
        const modules = ['twitter','youtube','starboard','clownboard','information','antinuke_swag','moderation','misc','levels','voicemaster','antiraid','owner','autorole','timers','fun','lastfm','servers','tickets','music']
        if (!args[0] || !modules.includes(args[0])) return;
        client.commands.sweep(() => true)
        glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
            
            if (err) return console.log(err);
            filePaths.forEach((file) => {
                
                delete require.cache[require.resolve(file)];

                const pull = require(file);
                if (pull.name) {
                    console.log(`[WS => Shard 0] [Reload] Reloaded ${pull.name}`);
                    client.commands.set(pull.name, pull);
                }

                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach((alias) => {

                        client.aliases.set(alias, pull.name);
                    });
                }
            });
        });
        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Reloaded cog **${args[0]}**`).setColor(colors.approve)] })
    }
};