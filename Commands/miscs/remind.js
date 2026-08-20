// Schemas for remind
const remindSchema = require('../../Models/remind')

// Embed configurations
const { MessageEmbed, Message } = require('discord.js')
const colors = { approve: '#a5ec77', deny: '#ef5f5c', warn: '#ffa602', blurple: '#6e87c9', help: '#718090' }
const emojis = require('../../Data/emojis.json')


// Objects for the command options
const remove = {  name: 'remind remove', description: 'Remove a reminder', aliases: 'delete, del', parameters: 'id', information: `${emojis.cooldown} 5 seconds`, usage: 'Syntax: remind [remove|delete|del] <id>\nExample: remind remove 2' }
const list = { name: 'remind list', description: 'View a list of your reminders' }

// Packages we need
const ms = require('ms')
const prettyms = require('pretty-ms');

// Pagination function
const pagination = require('../../Functions/pagination')

module.exports = {
    name: 'remind',
    description: 'Get reminders for a duration set about whatever you choose',
    parameters: 'time, text',
    usage: 'Syntax: remind (duration) <reason>\nExample: remind 1h To get food',
    module: 'misc',
    options: [remove, list],
    run : async (client, message, args, Discord) => {
        try {
            const subCommand = args[0]
            const remindEmbed = new MessageEmbed().setAuthor({name: `${client.user.username} help`, iconURL: `${client.user.displayAvatarURL()}`}).setTitle(`Command: remind`).setDescription(`Get reminders for a duration set about whatever you choose\n\`\`\`Syntax: remind (duration) <reason>\nExample: remind 1h To get food\`\`\``).setColor(colors.help);
            if (!subCommand) return message.channel.send({ embeds: [remindEmbed] })
            if (subCommand === 'remove' || subCommand === 'delete' || subCommand === 'del') {
                const disabledEmbed = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: This command has been **permanently** disabled due to [nick឵឵#1337](https://discord.com/users/917210373051011142) being lazy and not wanting to do this. Sorry about the inconvenience.`).setColor(colors.warn)
                return message.channel.send({ embeds: [disabledEmbed] })
            } else if (subCommand === 'list') {
                const remindData = await remindSchema.findOne({
                  userId: message.author.id
                });
                if (!remindData || remindData.userData.length < 0)
                  return message.channel.send({
                    embeds: [new MessageEmbed({
                      description: `:mag_right: ${message.author}: You don't have any **reminders** set!`,
                      color: `#7189da`
                    })]
                  });
            
                const listOfEmbeds = [];
                let i = 0;
                let itemsCount = 0;
            
                let pagedData = remindData.userData.pager(10);
                pagedData.forEach((page) => {
                  page.forEach((user) => ++itemsCount);
                });
            
                pagedData.forEach((page) => {
                  let gs = page
                    .map((user) => {
                      let date = user.date;
                      if (user.reminder === 'hi') {
                        return `\`${++i}\` ${user.reminder} (\`${date}\`) - Reminder is hi XD`;
                      } else {
                        return `\`${++i}\` ${user.reminder} (\`${date}\`)`;
                      }
                    })
                    .join("\n");
            
                  const embed = new MessageEmbed()
                    .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle("Reminders")
                    .setColor(message.member.displayHexColor)
                    .setDescription(gs)
                  listOfEmbeds.push(embed);
                });
            
                if (listOfEmbeds.length > 1) {
                  await pagination(message, listOfEmbeds, pagedData.length, itemsCount);
                } else {
                  return message.channel.send({ embeds: [listOfEmbeds[0]] });
                }
            } else {
                const time = args[0]
                const text = args.slice(1).join(' ')
                if (!text) return message.channel.send('so you want me to remind you nothing?')
                const seconds = ms(time)
                const longtime = prettyms(seconds, {verbose: true})
                const durationEmbed = new MessageEmbed().setDescription(`${emojis.warn} ${message.author} Duration must be longer than **24 seconds**!`).setColor(colors.warn)
                if (seconds < 24000) return message.channel.send({ embeds: durationEmbed })
                const secondsEmbed = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your **timer** is formatted incorrectly - ex: \`remind 5m hot pocket\``).setColor(colors.warn)
                if (!seconds) return message.channel.send({ embeds: [secondsEmbed] })
                const remindData = await remindSchema.findOne({ userId: message.author.id });
                if (!remindData) {
                    let item = {};
                    item.userId = message.author.id
                    item.userData = [{
                      reminder: text,
                      date: new Date().toLocaleDateString("en-US"),
                    },];
                    let newData = await remindSchema.create(item);
                    newData.save();
                  } else if (remindData) {
                    remindData.userData.push({
                      reminder: text,
                      date: new Date().toLocaleDateString("en-US"),
                    });
                    await remindSchema.findOneAndUpdate({
                      userId: message.author.id,
                    }, remindData);
                  }
                message.channel.send(`ok ill remind u in ${longtime}`)  
                setTimeout( async () => {
                    // Remind here (later)
                }, seconds)
                
            }
        } catch (error) {
            console.log(`${error}`)
            const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **remind**. Try again later.`).setColor(colors.warn).setFooter({ text: `${error}` })
            return message.channel.send({ embeds: [errorEmbed] })
        }
    }
}