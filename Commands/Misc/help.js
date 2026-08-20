const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require("discord.js")

const pagination = require('../../Functions/pagination')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const config = require('../../Data/config.json')

const util = require('util');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    parameters: ['command'],
    module: 'misc',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Help
     */

    run: async (client, message, args, prefix) => {
        if (args[0]) {
            const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))
            if (!command || command.name === undefined || command.hidden) return await new client.failure(message).send(`Command \`${args.join(' ')}\` does not exist`)
            if (args[1]) {
                const subcommand = client.subcommands.get(`${command.name} ${args[1]}`) || client.subcommands.get(client.subaliases.get(`${command.name} ${args[1]}`))
                if (!subcommand || subcommand.name === undefined || subcommand.hidden) return await new client.failure(message).send(`Command \`${args.join(' ')}\` does not exist`)
                const subcommandEmbed = new MessageEmbed().setAuthor({ name : `${message.member.displayName}`, iconURL : message.member.displayAvatarURL({ dynamic : true, size : 1024 }) }).setTitle(`${subcommand.commands && Array.isArray(subcommand.commands) ? 'Group Command' : 'Command'}: ${subcommand.name}`).setDescription(`${subcommand.description !== undefined ? subcommand.description : ''}`).addField(`**Aliases**`, `${subcommand.aliases !== undefined ? Array.isArray(subcommand.aliases) ? subcommand.aliases.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Parameters**`, `${subcommand.parameters !== undefined ? Array.isArray(subcommand.parameters) ? subcommand.parameters.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Information**`, `${subcommand.information !== undefined ? util.isObject(subcommand.information) ? `${subcommand.information.permissions ? `${emojis.warn} ${subcommand.information.permissions}` : ''}\n${subcommand.information.note ? `:notepad_spiral: ${subcommand.information.note}` : ''}\n${subcommand.information.cooldown ? `${emojis.cooldown} ${subcommand.information.cooldown}` : ''}` : 'N/A' : 'N/A'}`, true).addField(`**Usage**`, `\`\`\`${subcommand.usage !== undefined ? util.isObject(subcommand.usage) ? `${subcommand.usage.syntax ? subcommand.usage.example ? `Syntax: ${prefix}${subcommand.usage.syntax}\nExample: ${prefix}${subcommand.usage.example}` : `Syntax: ${prefix}${subcommand.usage.syntax}` : 'No syntax has been set for this command'}` : 'No syntax has been set for this command' : 'No syntax has been set for this command'}\`\`\``, false).setFooter({ text : `Page 1/1 (1 entry) ∙ Module: ${command.module || '?'}` }).setColor(colors.help)
                if (subcommand.commands) {
                    subcommand.commands = shuffle(subcommand.commands); const embeds = []; embeds.push(subcommandEmbed); for (const cmd of subcommand.commands) {
                        const push = new MessageEmbed().setAuthor({ name : `${message.member.displayName}`, iconURL: message.member.displayAvatarURL({ dynamic : true, size : 1024 }) }).setTitle(`Command: ${cmd.name}`).setDescription(`${cmd.description !== undefined ? cmd.description : ''}`).addField(`**Aliases**`, `${cmd.aliases !== undefined ? Array.isArray(cmd.aliases) ? cmd.aliases.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Parameters**`, `${cmd.parameters !== undefined ? Array.isArray(cmd.parameters) ? cmd.parameters.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Information**`, `${cmd.information !== undefined ? util.isObject(cmd.information) ? `${cmd.information.permissions ? `${emojis.warn} ${cmd.information.permissions}` : ''}\n${cmd.information.note ? `:notepad_spiral: ${cmd.information.note}` : ''}\n${cmd.information.cooldown ? `${emojis.cooldown} ${cmd.information.cooldown}` : ''}` : 'N/A' : 'N/A'}`, true).addField(`**Usage**`, `\`\`\`${cmd.usage !== undefined ? util.isObject(cmd.usage) ? `${cmd.usage.syntax ? cmd.usage.example ? `Syntax: ${prefix}${cmd.usage.syntax}\nExample: ${prefix}${cmd.usage.example}` : `Syntax: ${prefix}${cmd.usage.syntax}` : 'No syntax has been set for this command'}` : 'No syntax has been set for this command' : 'No syntax has been set for this command'}\`\`\``, false).setFooter({ text: `Page 1/1 (1 entry) ∙ Module: ${command.module || '?'}` }).setColor(colors.help); embeds.push(push)
                        if (cmd.commands) {
                            cmd.commands = shuffle(cmd.commands); for (const cmd2 of cmd.commands) {
                                const push2 = new MessageEmbed().setAuthor({ name : `${message.member.displayName}`, iconURL: message.member.displayAvatarURL({ dynamic : true, size : 1024 }) }).setTitle(`Command: ${cmd2.name}`).setDescription(`${cmd2.description !== undefined ? cmd2.description : ''}`).addField(`**Aliases**`, `${cmd2.aliases !== undefined ? Array.isArray(cmd2.aliases) ? cmd2.aliases.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Parameters**`, `${cmd2.parameters !== undefined ? Array.isArray(cmd2.parameters) ? cmd2.parameters.join(', ') : 'N/A' : 'N/A'}`, true).addField(`**Information**`, `${cmd2.information !== undefined ? util.isObject(cmd2.information) ? `${cmd2.information.permissions ? `${emojis.warn} ${cmd2.information.permissions}` : ''}\n${cmd2.information.note ? `:notepad_spiral: ${cmd2.information.note}` : ''}\n${cmd2.information.cooldown ? `${emojis.cooldown} ${cmd2.information.cooldown}` : ''}` : 'N/A' : 'N/A'}`, true).addField(`**Usage**`, `\`\`\`${cmd2.usage !== undefined ? util.isObject(cmd2.usage) ? `${cmd2.usage.syntax ? cmd2.usage.example ? `Syntax: ${prefix}${cmd2.usage.syntax}\nExample: ${prefix}${cmd2.usage.example}` : `Syntax: ${prefix}${cmd2.usage.syntax}` : 'No syntax has been set for this command'}` : 'No syntax has been set for this command' : 'No syntax has been set for this command'}\`\`\``, false).setFooter({ text: `Page 1/1 (1 entry) ∙ Module: ${command.module || '?'}` }).setColor(colors.help); embeds.push(push2)         
                            }
                        }
                    }; await pagination(message, embeds, embeds.length, embeds.length, ` (${embeds.length} ${embeds.length === 1 ? 'entry' : 'entries'}) ∙ Module: ${command.module}`)
                } else {
                    return message.channel.send({ embeds : [subcommandEmbed] })
                }
            } else {
                const help = new MessageEmbed()
                .setTitle(`${command.module ? command.module : 'Unlisted'} ${command.commands ? 'Group' : 'Command'}: ${command.name}`)
                .setColor(colors.color)
                .setDescription(`${command.description || ''}`)
                .addField(`Aliases`, `${command.aliases ? Array.isArray(command.aliases) ? command.aliases.join(', ') : 'N/A' : 'N/A'}`, true)
                .addField(`Permissions`, `${command.permissions ? `${command.permissions[0]}` : 'N/A'}`, true)
                .addField(`Examples`, `${command.usage ? command.usage.examples ? prefix + command.usage.examples.join(`\n${prefix}`) : 'N/A' : 'N/A'}`, true)
                .addField(`Usage`, `\`\`\`${command.usage ? command.usage.syntax ? prefix + command.usage.syntax : 'N/A' : 'N/A'}\`\`\``)
                if (command.commands) {
                    help.addField(`Commands`, `${command.commands.map(command => `${prefix}lastfm ${command.name} - ${command.description || 'bruh'}`).join('\n')}`)
                    message.channel.send({ embeds : [help] })
                
                } else {
                    message.channel.send({ embeds : [help] })
                }
            }
        } else {
            return message.channel.send(`${message.author}: view the commands @ https://github.com/n6ck/help (not finished)`)
        }
    },
};

function shuffle(array) { let currentIndex = array.length,  randomIndex; while (currentIndex != 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--; [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; }; return array; }


 //const listOfEmbeds = [];
   //     let i = 0;
     //   let pagedData = array.pager(3);
       // pagedData.forEach(async(page) => {
    //        const embed = new Discord.MessageEmbed()
     ///       .setAuthor({ name : `${message.member.displayName}`, iconURL : message.author.displayAvatarURL({ dynamic : true }) })
      ///      .setTitle('Search Results')
           // .setFooter({ text : 'Page 1/1 of Google Search Results (Not Safe)', iconURL : 'https://raven.bot/img/google.png' })
        ///    .setColor(message.member.displayHexColor)
              //  page.map((list) => {embed.addField(`**${list.title}**`, `**${list.link}**\n${list.snippet}`) })
            /////    listOfEmbeds.push(embed)
      //  })//;
    //    if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, i, ` of Google Search Results (Not Safe)`, 'https://raven.bot/img/google.png'); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }