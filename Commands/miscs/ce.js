const { MessageEmbed } = require('discord.js') 
module.exports = {
    name : 'createembed',
    aliases : ['ce'],
    run : async (client, message, args) => {
        const embed = new MessageEmbed()
        let msg = ''
        for (let str of args.join(' ').replaceAll('{guild.name}', message.guild.name).replaceAll('{guild.icon}', message.guild.iconURL({dynamic:true})).split('{').values()) {
            if (str.startsWith('title:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('title:', '').trim()
                embed.setTitle(`${str}`)
            } else if (str.startsWith('description:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('description:', '').trim()
                embed.setDescription(`${str}`)
            } else if (str.startsWith('field:')) {
                let field = str.replace('}', '').replace('$v', '').replace('field:', '').split('&&')
                embed.addField(`${field[0].toString().trim()}`, `${field[1].toString().trim()}`, field[2] ? field[2].toString().trim() === 'true' ? true : false : null)
            } else if (str.startsWith('author:')) {
                let author = str.replace('}', '').replace('$v', '').replace('author:', '').split('&&')
                embed.setAuthor({ name : `${author[0]}`, iconURL : author[1] ? author[1] : null, url : author[2] ? author[2] : null })
            } else if (str.startsWith('footer:')) {
                let footer = str.replace('}', '').replace('$v', '').replace('footer:', '').split('&&')
                embed.setFooter({ text : `${footer[0]}`, iconURL : footer[1] ? footer[1] : null })
            } else if (str.startsWith('thumbnail:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('thumbnail:', '').trim()
                embed.setThumbnail(`${str}`)
            } else if (str.startsWith('image:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('image:', '').trim()
                embed.setImage(`${str}`)
            } else if (str.startsWith('color:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('color:', '').trim()
                embed.setColor(`${str}`)
            } else if (str.startsWith('timestamp:')) {
                embed.setTimestamp()
            } else if (str.startsWith('url:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('url:', '').trim()
                embed.setURL(`${str}`)
            } else if (str.startsWith('message:')) {
                str = str.toString().replace('}', '').replace('$v', '').replace('message:', '').trim()
                msg = str
            }
        }
        message.channel.send({embeds : [embed], content : msg.length > 0 ? msg : null})
    }
}