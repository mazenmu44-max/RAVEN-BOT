const servers = require('../../Models/Staff/server')
const { MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const pagination = require('../../Functions/pagination')
const emojis = require('../../Data/emojis.json')
const moment = require('moment')
module.exports = {
    name : 'server',
    aliases : ['guild'],
    hidden : true,
    pages : [
        {
            name : 'server add',
            aliases : ['allow'],
        },
        {
            name : 'server remove',
            aliases : ['delete', 'del']
        }
    ],
    run : async (client, message, args) => {

        const commands = ['add', 'allow', 'remove', 'delete', 'del']

        if (args[0] && args[0] === 'add' || args[0] && args[0] === 'allow') {
            const server = args[1]
            const user = args[2]
            if (!server || !user) return
            if (server.length !== 18) return;
            const payment = args[3]
            if (!payment) return;
            new servers({
                server : server,
                customer : user,
                payment : payment
            }).save()
            const invite = args[5]
            let i = false;
            if (invite) i = await client.fetchInvite(invite)
            
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}:  Whitelisted and added a __${payment === 'onetime' ? 'one-time payment' : 'one-time payment'}__ for **${i ? i.guild : server}**`).setColor(colors.approve)] })
        } else if (args[0] === 'list') {
            
        } else if (args[0]) {
            servers.findOne({ server : args[0] }).then(async(data) => {
                const initial_customer = client.users.cache.get(data.customer)
                const server = client.guilds.cache.get(data.server)
                const owner = await server.fetchOwner()
                const serverEmbed = new MessageEmbed()
                .setAuthor({ name : `${server.name}`, iconURL : server.iconURL({ dynamic : true }) })
                .setTitle('Guild Information')
                .setColor(colors.help)
                .addField(`**Guild**`, `${server.name} (\`${data.server}\`)`, true)
                .addField(`**Guild Owner**`, `${owner.user.tag} (\`${owner.user.id}\`)`, true)
                .addField(`**Initial Customer**`, `${initial_customer.tag} (\`${data.customer}\`)`, true)
                .addField(`**Initial Date**`, `${moment(new Date, "DD MM YYYY @ hh:mm")}`, true)
                .addField(`**Payment Info**`, `One-Time\n**1** payment\n${emojis.approve} __**No bills**__`, true)
                .addField(`**Remaining time**`, `No more bills! Bot was paid off`, true)
                let embeds =[]
                embeds.push(serverEmbed)
                await pagination(message, embeds, embeds.length, embeds.length)
            })
        }
    },
};