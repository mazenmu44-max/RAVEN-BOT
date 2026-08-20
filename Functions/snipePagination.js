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
  
  const pagination = async (message, embeds, numberOfPages, numberOfItems, footer, icon, snipe) => {
    embeds[0].setFooter({ text : `${embeds[0].footer ? embeds[0].footer.text : ''}`, iconURL : icon || null });
    const row = new MessageActionRow().addComponents(
      //new MessageButton().setCustomId("last").setEmoji('<:last:968145984221749298>').setStyle("SECONDARY"),
      new MessageButton().setCustomId("prev").setEmoji('<:previous:969543680824320050>').setStyle("PRIMARY"),
      //new MessageButton().setCustomId("cancel").setEmoji('⏹️').setStyle('PRIMARY'),
      new MessageButton().setCustomId("next").setEmoji('<:next:969543680534904852>').setStyle("PRIMARY"),
      //new MessageButton().setCustomId("first").setEmoji('<:first:968145984100114442>').setStyle("SECONDARY"),
      new MessageButton().setCustomId("skip").setEmoji('<:shuffle:969543515963031572>').setStyle("SECONDARY"),
    );
    let msg = await message.channel.send({
      embeds: [embeds[0]],
      components: [row],
    });
    const filter = async (i) => {
      await i.deferUpdate();
  
      if (i.user.id != message.author.id) {
        const notownerEmbed = new MessageEmbed()
          .setDescription(`${i.user}: you don't own this embed & can't interact with this button interface`)
          .setColor(colors.color)
        await i.followUp({
          embeds: [notownerEmbed],
          ephemeral: true
        });
      }
  
      return i.user.id == message.author.id;
    };
  
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 100000,
    });
  
    let index = 0;
    let cancelStatus = false;
  
    collector.on("collect", async (interaction) => {
      if (interaction.user.id != message.author.id) return;
  
      if (interaction.customId == "prev") {
        index = index > 0 ? --index : embeds.length - 1;
  
        embeds[index].setFooter({ text : `${embeds[index].footer ? embeds[index].footer.text : ''}`, iconURL : icon || null });
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (interaction.customId == "next") {
        index = index + 1 < embeds.length ? ++index : 0;
  
        embeds[index].setFooter({ text : `${embeds[index].footer ? embeds[index].footer.text : ''}`, iconURL : icon || null });
  
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (interaction.customId == "skip") {
        row.components.forEach((compo) => {
          compo.setDisabled(true);
        });
        msg.edit({ components : [row] })
        const skipEmbed = new MessageEmbed()
          .setDescription(`:1234: What **page** would you like to skip to?`)
          .setColor('#678dd5')
        await interaction.followUp({
          embeds: [skipEmbed],
          ephemeral: true,
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
            const passEmbed = new MessageEmbed()
              .setDescription(`${emojis.warn} You can only pass **numbers**!`)
              .setColor(colors.warn)
              m.delete()
            return await interaction.followUp({
              embeds: [passEmbed],
              ephemeral: true,
            });
          } else {
  
            const number = parseInt(m.content);
            index = number - 1;
            embeds[index].setFooter({ text : `${embeds[index].footer ? embeds[index].footer.text : ''}`, iconURL : icon || null });
            await m.delete();
            await msg.edit({
              embeds: [embeds[index]]
            });
  
          }
        });
        collect.on("end", async () => {
          row.components.forEach((compo) => {
            compo.setDisabled(false);
          });
          msg.edit({ components : [row] })
        });
      } else if (interaction.customId == "cancel") {
        cancelStatus = true;
        collector.stop();
        msg.delete()
      }
    });
  
    collector.on("end", async () => {
      if (cancelStatus) {
        return
      } else {
        return await msg.edit({
          components: [],
        });
      }
    });
  };
  
  module.exports = pagination;