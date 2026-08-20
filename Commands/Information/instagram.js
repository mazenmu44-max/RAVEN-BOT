const { MessageEmbed } = require('discord.js')
var ig = require('instagram-scraping');
module.exports = {
    name : 'instagram',
    description : 'Gets profile information on the given Instagram user',
    aliases : ['ig', 'insta'],
    parameters : 'username',
    usage : 'Syntax: instagram <username>\nExample: instagram _jon',
    module : 'information',
    run : async (client, message, args) => {
        const username = args[0]
        if (!username) return
        try {
            ig.scrapeUserPage(username).then((res) => {
                console.log(res)
                const instagram = new MessageEmbed()
                .setTitle(`${res.user.full_name === '' ? res.user.username : `${res.user.full_name} (@${res.user.username})`} ${res.user.is_private ? '🔒' : res.user.is_verified ? '☑️' : ''}`)
                .setURL(`https://instagram.com/${res.user.username}`)
                .addField(`**Posts**`, `${res.user.edge_owner_to_timeline_media.count}`, true)
                .setFooter({ text : `Instagram`, iconURL : '' })
                .setColor('#af2c9a')
                message.channel.send({ embeds : [instagram] })
            });
        } catch (error) {
            return message.channel.send('error')
        }
    },
};