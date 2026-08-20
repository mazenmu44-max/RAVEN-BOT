const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')

const names = require('../../Models/Misc/names')

module.exports = {
    name : 'clearnames',
    description : 'Reset your name history',
    usage : 'Syntax: clearnames',
    module : 'misc',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Clearnames
     */

    run : async (client, message, args) => {
        const msg = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Are you sure that you want to clear your **name history**?`).setColor(colors.warn)], components : [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('Approve').setCustomId('approve'), new MessageButton().setStyle('DANGER').setLabel('Decline').setCustomId('decline'))] })
        const filter = async (i) => { 
            await i.deferUpdate();
            if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
            return i.user.id == message.author.id;
        };
        const collector = msg.createMessageComponentCollector({ filter, time : 100000, });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === 'approve') {
                await names.findOneAndDelete({ user : message.author.id })
                msg.delete()
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Reset your **nickname** and **username** history`).setColor(colors.approve)] })
                collector.stop()
            } else if (interaction.customId === 'decline') {
                message.delete()
                msg.delete()
                collector.stop()
            }
        })
    },
};