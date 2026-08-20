const Discord = require('discord.js')
const pagination = require('../../Functions/pagination')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const colors = require('../../Data/colors.json')
const { warn, approve } = require('../../Data/emojis.json')
module.exports = {
    name : 'steal',
    run : async (client, message, args) => {
        let check = false, emotes = [], messageIndex = 0;
        message.channel.messages.fetch().then(async(messages) => {
            messages.forEach(async(msg) => {
                ++messageIndex
                if (check) return;
                const emojis = msg.content.match(/<a:.+?:\d+>|<:.+?:\d+>/g)
                if (emojis && emojis.length && emojis.length > 0) {
                    check = true;
                    for (const emoji of emojis) {
                        const emote = Discord.Util.parseEmoji(emoji)
                        const extention = emote.animated ? '.gif' : '.png';
                        const url = `https://cdn.discordapp.com/emojis/${emote.id + extention}`;    
                        emotes.push({ name : emote.name, id : emote.id, url : url })
                    }
                    const embeds = [];
                    let emotePager = emotes.pager(1);
                    emotePager.forEach(async(page) => {
                        const embed = new Discord.MessageEmbed()
                        page.map((emote) => {
                            embed.setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
                            .setTitle(`${emote.name}`).addField(`**Emoji ID**`, `\`${emote.id}\``, true)
                            .addField(`**Guild**`, `${client.emojis.cache.get(emote.id) ? client.emojis.cache.get(emote.id).guild.name : 'Unknown'}`, true)
                            .addField(`**Image URL**`, `[**Click here to open the image**](${emote.url})`, false)
                            .setImage(emote.url)
                            .setColor('#a1b0bf')
                            .setFooter({ text : `Page 1/1 (1 entry)` })
                        })
                        embeds.push(embed)
                    })
                    if (embeds.length > 1) {
                        const row = new MessageActionRow().addComponents(
                            new MessageButton().setEmoji('<:previous:945864920673714236>')
                            .setStyle('PRIMARY').setCustomId('previous'),
                            new MessageButton().setEmoji('<:next:945864920589803620>')
                            .setStyle('PRIMARY').setCustomId('next'),
                            new MessageButton().setEmoji('<:cancel:945864920455610410>')
                            .setStyle('DANGER').setCustomId('cancel'),
                            new MessageButton().setEmoji('✂️')
                            .setStyle('SECONDARY').setCustomId('copy')
                        )
                        let i = await message.channel.send({ embeds : [embeds[0].setFooter({ text : `Page 1/${embeds.length} (${embeds.length} entries)` })], components : [row] })
                        const filter = async (i) => { 
                            await i.deferUpdate();
                            if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
                            return i.user.id == message.author.id;
                        };
                        const collector = i.createMessageComponentCollector({ filter, time : 100000, });
                        let index = 0
                        collector.on("collect", async (interaction) => {
                        
                            if (interaction.customId === 'cancel') {
                                i.delete()
                            } else if (interaction.customId === 'copy') {
                                message.guild.emojis.create(interaction.message.embeds[0].image.url, interaction.message.embeds[0].title)
                                interaction.followUp({ embeds : [new MessageEmbed().setDescription(`${approve} ${message.author}: Added **emote** [\`${interaction.message.embeds[0].title}\`](${interaction.message.embeds[0].image.url}) to the guild`).setColor(colors.approve)], ephemeral : true })
                            } else if (interaction.customId == "previous") {
                                index = index > 0 ? --index : embeds.length - 1;
                          
                                embeds[index].setFooter({ text : `Page ${index + 1}/${embeds.length} (${embeds.length} entries)` });
                                await i.edit({
                                  embeds: [embeds[index]],
                                });
                              } else if (interaction.customId == "next") {
                                index = index + 1 < embeds.length ? ++index : 0;
                          
                                embeds[index].setFooter({ text : `Page ${index + 1}/${embeds.length} (${embeds.length} entries)` });
                          
                                await i.edit({
                                  embeds: [embeds[index]],
                                });
                            }
                        })
                        collector.on('end', async () => {
                            await i.edit({ components : [] })
                        })
                    } else {
                        const row = new MessageActionRow().addComponents(
                            new MessageButton().setEmoji('<:cancel:945864920455610410>').setStyle('DANGER').setCustomId('cancel'),
                            new MessageButton().setEmoji('✂️').setStyle('SECONDARY').setCustomId('copy')
                        )
                        let i = await message.channel.send({ embeds : [embeds[0]], components : [row] })
                        const filter = async (i) => { 
                            await i.deferUpdate();
                            if (i.user.id != message.author.id) { await i.followUp({ embeds : [new MessageEmbed().setDescription(`${warn} You're not the **author** of this embed!`).setColor(colors.warn)], ephemeral : true }); }   
                            return i.user.id == message.author.id;
                        };
                        const collector = i.createMessageComponentCollector({ filter, time : 100000, });
                        collector.on("collect", async (interaction) => {
                        
                            if (interaction.customId === 'cancel') {
                                i.delete()
                            } else if (interaction.customId === 'copy') {
                                message.guild.emojis.create(interaction.message.embeds[0].image.url, interaction.message.embeds[0].title)
                                interaction.followUp({ embeds : [new MessageEmbed().setDescription(`${approve} ${message.author}: Added **emote** [\`${interaction.message.embeds[0].title}\`](${interaction.message.embeds[0].image.url}) to the guild`).setColor(colors.approve)], ephemeral : true })
                            }
                        })
                        collector.on('end', async () => {
                            await i.edit({ components : [] })
                        })
                    }
                } else {
                    if (messageIndex === messages.size) {
                        return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${warn} ${message.author}: Couldn't find any **emotes** in the past \`100\` messages!`).setColor(colors.warn)] })    
                    }
                }
            })
        })
    }
}