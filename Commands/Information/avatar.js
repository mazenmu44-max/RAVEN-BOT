const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'avatar',
    aliases : ['av', 'avi', 'pfp', 'ab', 'ag'],
    
    run : async (client, message, args) => {
        let member = ''
        if (args[0]) member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || args[0]
        if (!args[0]) member = message.member
        const user = await client.users.fetch(client.users.resolveId(member)).catch(() => null);
        if (!user) return
        const avatar = new MessageEmbed() 
        .setTitle(`${user.username}'s avatar`)
        .setURL(user.displayAvatarURL({ dynamic : true, size : 1024 }))
        .setImage(user.displayAvatarURL({ dynamic : true, size : 1024 }))
        .setColor(message.member.displayHexColor)
        member === message.member ? null : avatar.setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
        message.channel.send({ embeds : [avatar] })
    }
}