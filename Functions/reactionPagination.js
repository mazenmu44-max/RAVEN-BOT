const {
    Message,
    MessageButton,
    MessageActionRow,
    MessageEmbed,
  } = require("discord.js");
  const emojis = require('../Data/emojis.json')
  const colors = {
    raven: '#6e87c9',
    warn: '#ffa602',
    color: '#a1b0bd'
  }
  
  /*PAGINATION*/
  
  /**
   *
   * @param {Message} message  - The message
   * @param {Array} embeds  - Array of embeds
   * @returns Pagination
   */
  
  const pagination = async (message, embeds, numberOfPages, numberOfItems, footer) => {
    //embeds[0].setFooter(`${footer || ''}page 1 of ${numberOfPages}`);
    let msg = await message.channel.send({ embeds: [embeds[0]] });
    await msg.react(`<:previous:951138926230392833>`)
    await msg.react(`<:cancel:951138927408988160>`)
    await msg.react(`<:next:951138924779159592>`)
    const filter = async (reaction, user) => {
        if (user.id != message.author.id) return;
        return user.id == message.author.id;
    };
  
    const collector = msg.createReactionCollector({
      filter,
      time: 100000,
    });
  
    let index = 0;
    let cancelStatus = false;
  
    collector.on("collect", async (reaction) => {
      //if (reaction.user.id != message.author.id) return;
      reaction.users.remove(message.author)
      if (reaction.emoji.name === 'next') {
        index = index > 0 ? --index : embeds.length - 1;
  
        //embeds[index].setFooter(
          //`${footer || ''}page ${index + 1} of ${numberOfPages}`
        //);
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (reaction.emoji.name === 'right') {
        index = index + 1 < embeds.length ? ++index : 0;
  
        //embeds[index].setFooter(
          //`///${footer || ''}page ${index + 1} of ${numberOfPages}`
        //);
  
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (reaction.emoji.name === '🔢') {
        const skipEmbed = new MessageEmbed()
          .setDescription(`${message.author}: what page would you like to jump to?`)
          .setColor(colors.color)
        let mes = await message.channel.send({
          embeds: [skipEmbed]
        });
        const filter2 = (m) => {
          return m.author.id == message.author.id;
        };
  
        const collect = msg.channel.createMessageCollector({
          filter: filter2,
          time: 10000,
          max: 1,
        });
  
        collect.on("collect", async (m) => {
          if (isNaN(m.content)) {
            collect.stop();
            return;
          } else {
            const number = parseInt(m.content);
            index = number - 1;
            //embeds[index].setFooter(`${footer || ''}page ${index + 1} of ${numberOfPages}`);
            await m.delete();
            await mes.delete()
            await msg.edit({
              embeds: [embeds[index]]
            });
  
          }
        });
      } else if (reaction.emoji.name === 'cancel') {
        collector.stop();
      } 
    });
  
    collector.on("end", async () => {
      if (cancelStatus) {
        return
      } else {
        return msg.reactions.removeAll()
      }
    });
  };
  
  module.exports = pagination;