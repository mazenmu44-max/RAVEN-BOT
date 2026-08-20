const { MessageEmbed } = require('discord.js')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const ms = require("ms")
const jailSchema = require('../../Models/Moderation/jail')
const jaillogSchema = require('../../Models/Moderation/jaillog')

module.exports = { 
    name : 'setme',
    description : 'Start process for setting up the moderation system',
    permissions : ['ADMINISTRATOR'],
    information : `${emojis.warn} Administrator`,
    usage : 'Syntax: setme',
    module : 'moderation',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Setme
     */

    run : async (client, message, args) => {
        function wait(ms) {
            let start = new Date().getTime();
            let end = start;
            while (end < start + ms) {end = new Date().getTime();}
        }
        const starting = new MessageEmbed().setDescription(`<a:loading:947560459471585280> ${message.author}: Starting moderation setup...`).setColor(`#658b93`)
        let embed = await message.channel.send({ embeds : [starting] })
        try {
            const working = new MessageEmbed().setDescription(`<a:loading:947560459471585280> ${message.author}: Working moderation setup...`).setColor(`#658b93`)
            await wait(500);
            embed.edit({ embeds : [working]})
            let jailchannel = await message.guild.channels.create('jail', { type : "text" });
            let jaillogs = await message.guild.channels.create('jail-log', { type : "text" })
            await message.guild.roles.create({ name : 'jailed', permissions : [], })
            jailchannel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { SEND_MESSAGES: false, ADD_REACTIONS: false, VIEW_CHANNEL: false, })
            jaillogs.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { SEND_MESSAGES: false, ADD_REACTIONS: false, VIEW_CHANNEL: false, })
            message.guild.channels.fetch().then(channels => { channels.forEach(channel => { channel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "jailed"), { SEND_MESSAGES: false, ADD_REACTIONS: false, VIEW_CHANNEL: false, }) })})
            jailchannel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "jailed"), { SEND_MESSAGES: true, ADD_REACTIONS: false, VIEW_CHANNEL: true, })
            new jailSchema({ guildId: message.guild.id, channel: jailchannel.id }).save()
            new jaillogSchema({ guildId: message.guild.id, channel: jaillogs.id }).save()
        } catch (error) {
            return
        }
        const finished = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: **Moderation system set up** has been completed. Please make sure that all of your channels and roles have been configured properly.`).setColor(colors.approve)
        await wait(1000);
        embed.edit({ embeds : [finished] })
        await embed.delete
    }
}