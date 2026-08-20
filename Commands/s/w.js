const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: 'w',
    run : async (client, message) => {
        let array = []
        let index = 0
        message.guild.members.cache.forEach((member) => {
            index++
            if (index > 10) return;
            var bot = ''
            if (member.user.bot) bot = `BOT`
            array.push({
                label: `${member.user.tag} ${bot}`,
                customId: `${member.user.id}`,
                value: `${member.user.id}`,
            })
        })
        const selectModules = new MessageEmbed().setDescription(`.`).setColor(`#a1b0bd`)
                const selectMenu = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('help_dropdown').setPlaceholder('select a member...').setMaxValues(1)
                .setOptions(
                    array
                ))
                const m = await message.channel.send({
                    embeds: [selectModules],
                    components: [selectMenu]
                })
    }
}