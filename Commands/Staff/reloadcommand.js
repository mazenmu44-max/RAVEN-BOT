const glob = require("glob"); const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
module.exports = {
    name : 'rlcmd',
    aliases : ['rlc', 'reloadcommand', 'reloadcmd'],
    hidden : true,
    run : async (client, message, args, prefix) => {
        if (message.author.id !== '944099356678717500') return;
        if (args[0] === 'lastfm') {
            if (!args[1]) return; client.lastfm.sweep(() => true)
            glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
                
                if (err) return console.log(err);
                filePaths.forEach((file) => {
                    
                    delete require.cache[require.resolve(file)];
    
                    const pull = require(file);
                    if (pull.name) {
                        client.commands.set(pull.name, pull);
                    }
    
                    if (pull.aliases && Array.isArray(pull.aliases)) {
                        pull.aliases.forEach((alias) => {
    
                            client.aliases.set(alias, pull.name);
                        });
                    }
                });
            });
        }   
    }
}