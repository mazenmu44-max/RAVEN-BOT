const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const { MessageEmbed } = require('discord.js')

const blacklist = require('../../Models/Staff/blacklist')

module.exports = {
    name : 'blacklist',
    aliases : ['bl'],
    run : async (client, message, args) => {
        const staff = ['944099356678717500', '944099356678717500']
        if (!staff.includes(message.author.id)) return;

        const command = args[0]
        if (!command) return message.channel.send('test')
        const subcommand = args[1]

        if (command) {
            if (command === 'user') {
                if (subcommand) {
                    if (subcommand === 'add') {
                        const id = args[2]
                        if (!id) return;

                        let member = await message.mentions.members.first() || message.guild.members.cache.get(id) || id

                        const user = await client.users.fetch(client.users.resolveId(member)).catch(() => null);
                        if (!user) return;
                        if (user.id === '917210373051011142') return message.channel.send('leave that nigga alone')

                        new blacklist({ client : client.user.id, user : user.id }).save()
            
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Success, added **${user.tag}** to the blacklist`).setColor(colors.approve)] })
                    } else if (subcommand === 'remove') {
                        const id = argsraid
                        [2]
                        if (!id) return;

                        let member = await message.mentions.members.first() || message.guild.members.cache.get(id) || id

                        const user = await client.users.fetch(client.users.resolveId(member)).catch(() => null);
                        if (!user) return;
                        //message.channel.send(`${user.displayAvatarURL({ dynamic : true, size : 1024 })}`)
                        await blacklist.findOneAndRemove({ client : client.user.id, user : user.id })
                
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Success, removed **${user.tag}** from the blacklist`).setColor(colors.approve)] }) 
                    }
                }
            }
        }
    },
};