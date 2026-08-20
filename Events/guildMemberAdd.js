const client = require('../bleed')
const autonickSchema = require('../Models/Servers/autonick')
const welcomeSchema = require('../Models/Servers/welcome')
client.on("guildMemberAdd", async (member) => {
    let autonick = await autonickSchema.findOne({ guild : member.guild.id })
    if (autonick) {
        member.setNickname(`${autonick.nickname}`)
    } else {
        return;
    }
})
client.on('guildMemberAdd', async (member) => {
    const newusers = require('../Models/Moderation/newusers')
    new newusers({ guild : member.guild.id, user : member.user.id, timestamp : member.joinedTimestamp }).save()
})
client.on('guildMemberAdd', async (member) => {
    member.guild.channels.cache.forEach((channel) => {
        welcomeSchema.findOne({ guild : member.guild.id, channel : channel.id }).then(async(data) => {
            if (!data) return;
            try {
                let json = await JSON.parse(data.message)
                if ({}.hasOwnProperty.call(json, "thumbnail")) { json.thumbnail = { url: json.thumbnail }; }
                if ({}.hasOwnProperty.call(json, "image")) { json.image = { url: json.image }; }
                if ({}.hasOwnProperty.call(json, "footer")) { json.footer = { text: json.footer.text, icon_url: json.footer.icon_url }; }
                channel.send({ embeds : [json] })
            } catch (error) {
                let msg = `${data.message}`
                msg = msg.replace('{user}', `${member.user.tag}`)
                msg = msg.replace('{user.mention}', `${member}`)
                channel.send(`${msg}`).then((x) => {
                    if (data.self_destruct) {
                        setTimeout(() => {
                            x.delete()
                        }, data.self_destruct)
                    }
                })
            }
        })
    })
})
const moment = require('moment')
const { MessageEmbed } = require('discord.js')
const joinlogs = require('../Models/Servers/joinlogs')
client.on('guildMemberAdd', async (member) => {
    await joinlogs.findOne({ guild : member.guild.id }).then(async (data) => {
        console.log(data)
        if (data) {
            const channel = client.channels.cache.get(data.channel)
            if (channel) {
                const log = new MessageEmbed()
                .setAuthor({ name : `${member.user.tag} joined the server (${member.user.id})`, iconURL : member.user.displayAvatarURL({ dynamic : true }) })
                .setDescription(`**Created:** ${moment(member.user.createdAt).format("MMMM D, YYYY @ h:mm A")} (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`)
                .setFooter({ text : `Member count is now: ${member.guild.memberCount}` })
                .setTimestamp()
                .setColor('#2ecc71')
                channel.send({ embeds : [log] })
            }
        }
    })
})