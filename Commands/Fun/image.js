const axios = require('axios')
const pagination = require('../../Functions/pagination')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'img',
    run : async (client, message, args, prefix) => {
        let googKey = "AIzaSyDHcNBPqv-GpTR6_oyA6EnTyiRXeGUjokI";
        let cxKey = "b7498d486b2d19b97"; 
        const url = `https://www.googleapis.com/customsearch/v1?key=${googKey}&cx=${cxKey}&q=${args.join(' ')}&searchType=image${message.channel.nsfw ? '' : '&safe=active'}&alt=json&start=1`
        await axios(url).then(async res => {
            const images = res.data.items
            console.log(images)
            if (!images) {
                return
            };
            let embeds = []
            images.forEach(async (result) => {
                const page = new MessageEmbed()
                .setTitle(`${result.displayLink.toString().replace('www', '').replace('.com', '')} (${result.displayLink})`)
                .setDescription(`[${result.snippet}](${result.image.contextLink})`)
                .setImage(result.link)
                if (embeds.length < 100) embeds.push(page)
            });
            if (embeds.length > 1) { await pagination(message, embeds, embeds.length, embeds.length, ' of Google Image Search Results (Safe)', 'https://raven.bot/img/google.png'); } else { return message.channel.send({ embeds: [embeds[0]] }); }
        })
    }
}