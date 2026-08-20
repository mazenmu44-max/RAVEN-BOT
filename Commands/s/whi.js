const cheerio = require('cheerio')
const axios = require('axios')
const {
    MessageEmbed
} = require('discord.js')
const colors = require('../../Data/colors.json')
module.exports = {
        name: 'weheartit',
        aliases: ['whi'],
        run: async (client, message, args) => {
            const username = args[0]
            
            if (!username) return;

            axios.get(`https://weheartit.com/${username}`).then(results => {

                var hearts = []
                var avatar = []
                var displayname = []
                var description = []
                var collections = []
                var posts = []
                var following = []

                if (!results || results.length < 1) return;

                const scrape = cheerio.load(results.data)

                // Avatar
                scrape('a.avatar-large').each((i, element) => {
                    const avatarUrl = scrape(element).find('img.avatar').attr('src')
                    avatar.push(avatarUrl)
                })
                // Hearts count
                scrape('li.active').each((i, element) => {
                    const heartsSize = scrape(element).text()
                    var h = heartsSize.replace('Hearts', '').replace(/\s+/g, '')
                    hearts.push(h)
                })
                // Display name
                scrape('h1.text-overflow').each((i, element) => {
                    const displaynameStuff = scrape(element).find('a').text()
                    var n = displaynameStuff.replace(/\s+/g, '')
                    displayname.push(n)
                })
                // Description
                scrape('p.text-big').each((i, element) => {
                    const bio = scrape(element).text()
                    description.push(bio)
                })
                scrape('ul.bg-white').each((i, element) => {
                    const e = scrape(element).text()
                    var c = e.slice(20, 30).replace(/\s+/g, '')
                    var p = e.slice(45, 55).replace(/\s+/g, '').replace('Po', '')
                    var f = e.slice(65, 75).replace(/\s+/g, '').replace('Foll', '')
                    var f2 = e.slice(85, 95).replace(/\s+/g, '')
                    console.log(f2)
                    collections.push(c)
                    posts.push(p)
                    following.push(f)
                    
                })

                const weheartitEmbed = new MessageEmbed()
                .setAuthor({ name : `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic : true }) })
                .setTitle(`${username}`).setURL(`https://weheartit.com/${username}`).setThumbnail(avatar[0]).setDescription(`${description}`)
                .addField(`**Followers**`, `0`, true)
                .addField(`**Posts**`, `${posts || '0'}`, true)
                .addField(`**Collections**`, `${collections[0] || '0'}`, true)
                //.addField(`**following & followers**`, `0`, true)
                //.addField(`**feed**`, `hearts: **${hearts || '0'}**\ncollections: **${collections[0].replace('C', '') || '0'}**\nposts: **${posts || '0'}**`, true)
                //.addField(`**account**`, `followers: **0**\nfollowing: **${following}**`, true)
                //.addField(`**hearts**`, `${hearts[0].replace('Hearts', '')}`, true)
               // .addField(`**collections**`, `${collections || '0'}`, true)
               // .addField(`**posts**`, `0`, true)
               .setColor(colors.help).setFooter({
                    text: `WeHeartIt`,
                    iconURL: `https://images-ext-1.discordapp.net/external/BTu4YOhnD2B5Xn9EYjDd7CNpUar0VXO95aqaYOQslkg/https/pbs.twimg.com/profile_images/1004390651767578624/3z3MVyS2.jpg?width=473&height=473`
                })
                message.channel.send({
                    embeds: [weheartitEmbed]
                })
            }).catch((e) => {
                    return console.log(e);
                })
            }
        }