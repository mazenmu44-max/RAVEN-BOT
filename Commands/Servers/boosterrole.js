const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')

// Help (6 total)
const remove = { name : 'boosterrole remove', description : 'Remove custom color booster role', aliases : ['delete', 'del'], information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole remove', }
const icon = { name : 'boosterrole icon', description : 'Set a icon for booster role', parameters : 'url', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole icon (icon)\nExample: boosterrole icon url_Goes_here', }
const list = { name : 'boosterrole list', description : 'View all booster roles', aliases : ['view'], information : `${emojis.warn} Manage Guild`, usage : 'Syntax: boosterrole list', }
const dominant = { name : 'boosterrole dominant', description : 'Set booster roles color to the most dominant color in avatar', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole dominant', }
const rename = { name : 'boosterrole rename', description : 'Edit your booster roles name', parameters : 'new_name', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole rename (new name)\nExample: boosterrole rename boss role'}
const random = { name : 'boosterrole random', description : 'Set a booster role with a random hex code', aliases : ['randomhex'], information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole random', }

// Schemas
const boosterroleSchema = require('../../Models/Servers/boosterrole')
const baseroleSchema = require('../../Models/Servers/baserole')

module.exports = {
    name : 'boosterrole', 
    description : 'Get your own custom booster color role', 
    aliases : ['boostrole', 'br'], 
    parameters : 'color', 
    information : `${emojis.warn} Booster Only`, 
    usage : 'Syntax: boosterrole <hex code>\nExample: boosterrole ff0000', 
    module : 'servers',
    pages : [remove, icon, list, dominant, rename, random],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Boosterrole
     */

    run : async (client, message, args) => {
        const parameter = args[0]
        const boosterrole = client.commands.get('boosterrole')
        const commands = ['remove', 'delete', 'del', 'icon', 'list', 'view', 'dominant', 'rename', 'random', 'randomhex']
        try {
            const helpBoosterrole = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle(`Command: ${boosterrole.name}`).setDescription(`${boosterrole.description}\`\`\`${boosterrole.usage}\`\`\``).setColor('#718090')
            if (!parameter) return message.channel.send({ embeds : [helpBoosterrole] })
            if (!commands.includes(parameter)) {
                const booster = message.member.premiumSince
                const boosting = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You can't use this command. **Boost the server** and then try again.`).setColor(colors.deny)
                if (booster === null) return message.channel.send({ embeds: [boosting] })
                const regex = /^#([0-9a-f]{3}){1,2}$/i; const check = regex.test(parameter)
                const hex = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: **${parameter}** is an invalid hex code`).setColor(colors.deny)
                if (check === false) return message.channel.send({ embeds: [hex] })
                const boosterroleData = await boosterroleSchema.findOne({ guildId: message.guild.id, userId: message.author.id })
                const baseroleData = await baseroleSchema.findOne({ guildId: message.guild.id })
                const nobaseRole = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Server doesn't have a **base role** set for custom color roles. Server managers can run \`,settings baserole (role id)\` to solve this issue.`).setColor(colors.warn)
            if (!baseroleData) return message.channel.send({ embeds: [nobaseRole] })
                if (boosterroleData) {
                    await message.guild.roles.cache.get(boosterroleData.roleId).edit({ color: parameter })
                    const cool = new MessageEmbed().setDescription(`:art: ${message.author}: Your current **booster role color** was changed to \`${parameter}\``).setColor('#d89f85')
                    return message.channel.send({ embeds : [cool] })
                } else if (!boosterroleData) {
                    const baserole = message.guild.roles.cache.get(baseroleData.baseroleId)
                    const role = await message.guild.roles.create({ name: message.member.displayName, color: parameter, position: baserole.position, })
                    const newBoosterrole = new boosterroleSchema({ userId: message.author.id, guildId: message.guild.id, roleId: role.id })
                    newBoosterrole.save()
                    message.member.roles.add(role.id)
                    const cool = new MessageEmbed().setDescription(`:art: ${message.author}: Cool, you were assigned a **booster role** with hex code \`${parameter}\``).setColor('#d89f85')
                    return message.channel.send({ embeds : [cool] })
                }
            } else if (parameter === 'remove' || parameter === 'delete' || parameter === 'del') {
                const boosterroleData = await boosterroleSchema.findOne({ guildId: message.guild.id, userId: message.author.id })
                const noBoosterrole = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You don't have a **booster role**!`).setColor(colors.deny)
                if (!boosterroleData) return message.channel.send({ embeds : [noBoosterrole] })
                await boosterroleSchema.findOneAndDelete({ guildId: message.guild.id, userId: message.author.id })
                await message.guild.roles.cache.get(boosterroleData.roleId).delete().catch(() => {})
                const removed = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Removed your **booster role** for this server`).setColor(colors.approve)
                return message.channel.send({ embeds : [removed] })
            } else if (parameter === 'icon') {
                const noroleIcon = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Guild is missing at least **Level 2** to set a role icon`).setColor(colors.warn)
                if (!message.guild.features.includes('ROLE_ICONS')) return message.channel.send({ embeds : [noroleIcon] })
                const boosterroleData = await boosterroleSchema.findOne({ guildId: message.guild.id, userId: message.author.id })
                const noBoosterrole = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You don't have a **booster role**!`).setColor(colors.deny)
                if (!boosterroleData) return message.channel.send({ embeds : [noBoosterrole] })
            } else if (parameter === 'list' || parameter === 'view') {
                const boosterroleData = await boosterroleSchema.find({ guildId: message.guild.id })
                if (!boosterroleData || boosterroleData.length === 0) return message.channel.send({embeds: [new MessageEmbed({description: `:mag_right: ${message.author}: No **booster roles** found`, color: `#7189da`})]});
                let boosterroles = [];
                for (const br of boosterroleData) { boosterroles.push({ member: br.userId, role: br.roleId }); }
                const boosterrolePages = [];
                let boosterroleIndex = 0;
                let pages = boosterroles.pager(10);
                for (const page of pages) {
                    const boosterrolesMapped = page.map((br) => { return `\`${++boosterroleIndex}\` **${message.guild.members.cache.get(br.member).user.tag}**: ${message.guild.roles.cache.get(br.role)}` }).join("\n");
                    const push = new MessageEmbed().setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setTitle(`Booster roles`).setDescription(`${boosterrolesMapped}`).setColor(message.member.displayHexColor).setFooter({ text: `Page 1/1 (${boosterroleIndex} ${boosterroleIndex === 1 ? 'entry' : 'entries'})`})
                    boosterrolePages.push(push);
                };
                if (boosterrolePages.length > 1) { await pagination(message, boosterrolePages, pages.length, boosterroleIndex); } else { return message.channel.send({ embeds: [boosterrolePages[0]] }); }
            } else if (parameter === 'dominant') {

            } else if (parameter === 'rename') {
                const new_name = args.slice(1).join(' ')
                if (!new_name) return;
                const boosterroleData = await boosterroleSchema.findOne({ guildId: message.guild.id, userId: message.author.id })
                const noBoosterrole = new MessageEmbed().setDescription(`${emojis.deny} ${message.author}: You don't have a **booster role**!`).setColor(colors.deny)
                if (!boosterroleData) return message.channel.send({ embeds : [noBoosterrole] })
                const role = message.guild.roles.cache.get(boosterroleData.roleId)
                if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Your **booster role** does not exist - removed from database.`).setColor(colors.warn)] }).then(async() => { await boosterroleSchema.findOneAndDelete({ guildId: message.guild.id, userId: message.author.id })})
                if (role.position > message.guild.members.cache.get(client.user.id).roles.highest.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No permissions. That role is **above** my bot role on the hierarchy`).setColor(colors.warn)] })
                await role.edit({ name : new_name }).then(()=>{message.channel.send({embeds:[new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Your **booster role name** was successfully renamed!`).setColor(colors.approve)]})})
            }
        } catch (error) {
            message.channel.send(`${error}`)
        }
    },
};