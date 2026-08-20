const client = require('../bleed')
const { MessageEmbed } = require('discord.js') 
const servers = require('../Models/Staff/server')
const colors = require('../Data/colors.json')
client.on('guildCreate', async (guild) => {
    console.log(guild.memberCount)
    //if (guild.id !== '964368588624527400' && guild.memberCount < 75) return guild.leave()
    servers.findOne({ server : guild.id }).then((data) => {
        //if (!data) return guild.leave()
    })
    let ArrayOfChannels = []
    const owner = await guild.fetchOwner()
        guild.members.cache.get(client.user.id).setNickname('raven')
        const GettingStarted = new MessageEmbed().setTitle('Getting started with raven').setDescription('Hey! Thanks for your interest in **raven bot**. The following will provide you with some tips on how to get started with your server!').addField('**Prefix** :robot:', 'The most important thing is my prefix. It is set to `,` by default for this server and it is also customizable, so if you don\'t like this prefix, you can always change it with `prefix set` command!').addField('**Moderation System** :shield:', 'If you would like to use moderation commands, such as `jail`, `ban`, `kick` and so much more... please run the `setme` command to quickly set up the moderation system.').addField('**Documentation and Help** :books:', 'You can always visit our [documentation](https://docs.raven.bot) and view the list of commands that are available [here](https://raven.bot/help) - and if that isn\'t enough, feel free to join our [Support Server](https://discord.gg/raven) for extra assistance!').setThumbnail('https://raven.bot/img/bot_avatar_default.png').setColor('#69919d')
        for (const channel of guild.channels.cache) { ArrayOfChannels.push({ channel : channel.id }) }
        guild.systemChannel.send({ embeds : [GettingStarted] }).catch(() => {})
});
client.on('guildCreate', async (guild) => {
    //if (guild.id !== '957481721899659274' && guild.memberCount < 75) guild.leave()
    const owner = await guild.fetchOwner()
    const data = await servers.findOne({ server: guild.id })
    const log = new MessageEmbed()
    .setDescription(`Joined **${guild.name}**, owned by **${owner.user.tag}** with **${guild.memberCount}** members.`)
    .setFooter({ text : `${guild.id}` })
    .setColor(colors.raven)
    client.channels.cache.get('964372532474028092').send({ embeds : [log] })
}) 