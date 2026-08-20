const client = require('../bleed.js');
const emojis = require('../data/emojis.json');
const colors = require('../Data/colors.json')
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js')

class pagination {
    constructor(message, embeds, pages, items) {

        this.message = message;
        this.embeds = embeds;
        this.pages = pages;
        this.item = items;

    };
    async send() {
        this.embeds[0].setFooter({ text : `Page 1/${this.pages}` });

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId("left").setEmoji('<:pages_previous:945864920673714236>').setStyle("PRIMARY"),
    new MessageButton().setCustomId("right").setEmoji('<:pages_next:945864920589803620>').setStyle("PRIMARY"),
    new MessageButton().setCustomId("skipto").setEmoji('<:pages_fastforward:945864920602402876>').setStyle("SECONDARY"),
    new MessageButton().setCustomId("cancel").setEmoji('<:pages_cancel:945864920455610410>').setStyle('DANGER'),
        ); let i = await this.message.channel.send({ embeds : [this.embeds[0]], components : [row] });

        const filter = async (interaction) => {
            await interaction.deferUpdate();
            if (interaction.user.id != this.message.author.id) {
                await interaction.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true });
            }
            return interaction.user.id == this.message.author.id;
        };
        const collector = i.createMessageComponentCollector({ filter, time : 100000 });

        let index = 0, canceled = false;
        
        collector.on('collect', async (interaction) => {
            if (interaction.user.id != this.message.author.id) return;
            
            if (interaction.customId === 'left') {

                index = index > 0 ? --index : this.embeds.length - 1;
                this.embeds[index].setFooter({ text : `Page ${index + 1}/${this.pages}` });
                await i.edit({ embeds : [this.embeds[index]] });

            } else if (interaction.customId === 'right') {
                
                index = index + 1 < this.embeds.length ? ++index : 0;
                this.embeds[index].setFooter({ text : `Page ${index + 1}/${this.pages}` });
                await i.edit({ embeds : [this.embeds[index]] });
            
            } else if (interaction.customId === 'skipto') {
                
                row.components.forEach((component) => { component.setDisabled(true); }); i.edit({ components : [row] })
                await interaction.followUp({ embeds : [new MessageEmbed().setDescription(`:1234: What **page** would you like to skip to?`).setColor(colors.raven)], ephemeral : true });
                const skiptoFilter = (m) => { return m.author.id == this.message.author.id; }
                const skiptoCollector = i.channel.createMessageCollector({ filter : skiptoFilter, time : 10000, max : 1 });
                skiptoCollector.on('collect', async (m) => {
                    if (isNaN(m.content)) {
                        skiptoCollector.stop(); m.delete();
                        return await interaction.followUp({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} You can only pass **numbers**!`).setColor(colors.warn)], ephemeral : true });
                    } else { const number = parseInt(m.content); index = number - 1;
                        this.embeds[index].setFooter({ text : `Page ${index + 1}/${this.pages}` });
                        await m.delete(); await i.edit({ embeds : [this.embeds[index]] });
                    }
                });
                skiptoCollector.on('end', async () => {
                    row.components.forEach((component) => { component.setDisabled(false); });
                    i.edit({ components : [row] }) });
                } else if (interaction.customId === 'cancel') {
                    
                    canceled = true; collector.stop(); msg.delete()

                }
            });
            collector.on('end', async () => {
                if (canceled) {
                    return
                } else {
                    return await i.edit({ components: [] }); }
                });
            };
        };
        module.exports = { pagination };