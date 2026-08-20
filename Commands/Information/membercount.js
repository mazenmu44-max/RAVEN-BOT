const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js');

const ms = require('ms')
const time = ms('24h')

module.exports = {
    name : 'membercount',
    module : 'Information',
    description : 'View the server member count along with messages sent & new members',
    aliases : ['mc', 'memberscount'],
    information : 'Module: **Information**',
    usage : { syntax : 'membercount' },

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Membercount
     */

    run : async (client, message, args, Discord) => {
        let newMembers = 0; let newMessages = 0
        await message.guild.members.cache.forEach(async(member) => {
            if (Date.now() - new Date(member.joinedAt).getTime() < time) {
                ++newMembers
            }
        })
        await message.guild.channels.cache.forEach(async (channel) => {
            if (channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_CATEGORY') return;
            const messages = await channel.messages.fetch({ max : 100 })
                await messages.forEach(async (message) => {
                    if (Date.now() - new Date(message.createdAt).getTime() < time) {
                        ++newMessages
                    }
                })
        })
        setTimeout(() => {
            message.channel.send({ embeds : [
                new MessageEmbed()
                .addField(`Members`, `${message.guild.memberCount}`, true)
                .addField('Humans', `${message.guild.members.cache.filter(m => !m.user.bot).size}`, true)
                .addField(`Bots`, `${message.guild.members.cache.filter(m => m.user.bot).size}`, true)
                .setFooter({ text : `+${newMembers} Members, +${newMessages} Messages` })
                .setColor(colors.color)
            ] })
        }, 1000)
    }
}