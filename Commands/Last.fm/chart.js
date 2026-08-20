const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "chart",
run: async (client, message, args) => {
    let fm = 'ju2fast'
      
      // const img_url = `https://www.tapmusic.net/collage.php?user=${fmname}&type=${period}&size=3x3&caption=true&playcount=true`
      const img_url = (`https://lastfm-collage.herokuapp.com/collage?username=nickskv&method=album&period=7d&column=6&row=6&caption=false&scrobble=false`)
     const embed = new MessageEmbed()
     .setImage(img_url)
  
     return message.channel.send({ embeds: [embed] })
}}