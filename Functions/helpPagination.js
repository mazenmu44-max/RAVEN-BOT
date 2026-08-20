const {
    Message,
    MessageButton,
    MessageActionRow,
    MessageEmbed,
  } = require("discord.js");
  const emojis = require('../Data/emojis.json')
  const colors = { raven: '#6e87c9', warn: '#ffa602' }
  
  /*PAGINATION*/
  
  /**
   *
   * @param {Message} message  - The message
   * @param {Array} embeds  - Array of embeds
   * @returns Pagination
   */
  
  const pagination = async (message, embeds, numberOfPages, numberOfItems) => {
    ///embeds[0].setFooter(`Page 1/${numberOfPages} (${numberOfPages} entries)`);
  
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("prev").setEmoji('<:right_small_emote:938411192903409694>').setStyle("PRIMARY"),
    new MessageButton().setCustomId("next").setEmoji('<:left_small_emote:938411192995680277>').setStyle("PRIMARY"),
    new MessageButton().setCustomId("skip").setEmoji('<:shuffle_action_emote:938411192446255125>').setStyle("SECONDARY"),
    );
  
    let msg = await message.channel.send({
      embeds: [embeds[0]],
      components: [row],
    });
  
    const filter = async (i) => {
      await i.deferUpdate();
  
      if (i.user.id != message.author.id) {
        const notauthorEmbed = new MessageEmbed()
          .setDescription(`${emojis.warn} You're not the **author** of this embed!`)
          .setColor(colors.warn);
        await i.followUp({
          embeds: [notauthorEmbed],
          ephemeral: true,
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
  
        //embeds[index].setFooter(
          //`Page ${index + 1}/${numberOfPages} (${numberOfPages} entries)`
        //);
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (interaction.customId == "next") {
        index = index + 1 < embeds.length ? ++index : 0;
  
        //embeds[index].setFooter(
          //`Page ${index + 1}/${numberOfPages} (${numberOfPages} entries)`
        //);
  
        await msg.edit({
          embeds: [embeds[index]],
        });
      } else if (interaction.customId == "skip") {
        row.components.forEach((compo) => {
          compo.setDisabled(true);
        });
        const skipEmbed = new MessageEmbed()
        .setDescription(`:1234: What **page** would you like to skip to?`)
        .setColor(colors.raven);
        await interaction.followUp({
          embeds: [skipEmbed],
          ephemeral: true,
        });
        const filter2 = (m) => { return m.author.id == message.author.id; };
  
        const collect = msg.channel.createMessageCollector({
          filter: filter2,
          time: 10000,
          max: 1,
        });
  
        collect.on("collect", async (m) => {
          if (isNaN(m.content)) {
            collect.stop();
            const isnanEmbed = new MessageEmbed()
              .setDescription(`${emojis.warn} You can only pass **numbers**!`)
              .setColor(colors.warn);
            return await interaction.followUp({
              embeds: [isnanEmbed],
              ephemeral: true,
            });
          } else {
  
            const number = parseInt(m.content);
            index = number - 1;
            //embeds[index].setFooter(`Page ${index + 1}/${numberOfPages} (${numberOfPages} entries)`);
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