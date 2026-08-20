const { Color, isColor } = require('coloras');
const Discord = require('discord.js');

module.exports = {
    name : 'randomhex',
    description : 'Generate a random hex (color)',
    usage : 'Syntax: randomhex',
    module : 'misc',

  run: async (client, message, args) => {
    let random;

    if (!args.join(" ")) {
      random = true;
    } else {
      if (!isColor(args.join(" ")).Color) return;
    }

    const value = random ? null : args.join(" ");
    const color = new Color(value);

    const embed = new Discord.MessageEmbed()
      .setColor(color.toHex())
      .setAuthor({ name : `Showing hex code: ${color.toHex()}` })
      .addField(`RGB Value`, `${color.toRgb().replace('rgb(', '').replace(')', '')}`, true)
      .addField(`HSL Value`, `${color.toHsl().replace('hsl(', '').replace(')', '')}`, true)
      .setThumbnail(color.imageUrl);

    return message.channel.send({ embeds: [embed] });
  }
}