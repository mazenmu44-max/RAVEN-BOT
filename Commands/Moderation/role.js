const massrole = require('../../Models/Moderation/massrole')
const emojis = require('../../Data/emojis.json')
const colors = require('../../Data/colors.json')
const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'role',
    description : 'Modify a member\'s roles',
    parameters : 'member, role',
    permissions : ['MANAGE_ROLES'],
    information : `${emojis.warn} Manage Roles`,
    usage : `Syntax: role (member) <role name>\nExample: role ${config.ownertag} Owner`,
    module : 'moderation',
    pages : [
        {
            name : 'role humans',
            description : 'Add a role to all humans',
            parameters : 'role',
            permissions : ['MANAGE_ROLES', 'MANAGE_GUILD'],
            information : `${emojis.warn} Manage Roles & Manage Guild`,
            usage : 'Syntax: role humans (role)\nExample: role humans member'
        }
    ],
    run : async (client, message, args, prefix) => {
        if (!args[0]) return;
        if (args[0] === 'humans') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[1].toLowerCase()))
            if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args[1]}**`).setColor(colors.warn)] })
            if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= role.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${role} is **too high** for you to manage`).setColor(colors.warn)] })  
            await massrole.findOne({ guild : message.guild.id }).then(async (data) => {
                if (data) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${message.author}: The \`${prefix}${data.check}\` command is already **in use**, please use the \`${prefix}role cancel\` command or wait until the **current** process is finished`).setColor(colors.raven)] })
                const i = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${message.author}: Starting the **role adding** process..`).setColor(colors.raven)] })
                new massrole({ guild : message.guild.id, type : 'add', check : 'role humans', totalAdded : 0, role : role.id }).save().then(async (data2) => {
                    let check = 0
                    message.guild.members.cache.map(async (member) => {
                        if (!member.user.bot) {
                            ++check; 
                            if (!member.roles.cache.get(role.id)) {
                                member.roles.add(role.id); 
                                ++data2.totalAdded;
                                await massrole.findOneAndUpdate({ guild : message.guild.id }, data2)
                            }
                        }
                    })
                    if (check === message.guild.members.cache.filter(member => !member.user.bot).size) {
                        i.delete()
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`<:add:960154267140886538> ${message.author}: Added ${role} to **${String(data2.totalAdded)}** members`).setColor('36a9e0')] })
                        await massrole.findOneAndDelete({ guild : message.guild.id })
                    }
                })
            })
        } else if (args[0] === 'edit') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[1].toLowerCase()))
            if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args[1]}**`).setColor(colors.warn)] })
            if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= role.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${role} is **too high** for you to manage`).setColor(colors.warn)] })  
            if (!args[2]) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing a **name** to **rename** the role to`).setColor(colors.warn)] })
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Changed the role **${role.name}** name to \`${args.slice(2).join(' ')}\``).setColor(colors.approve)] })
            role.edit({ name : args.slice(2).join(' ') })

        } else if (args[0] === 'delete') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[1].toLowerCase()))
            if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args[1]}**`).setColor(colors.warn)] })
            if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= role.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${role} is **too high** for you to manage`).setColor(colors.warn)] })
            const i = await message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Are you sure that you would like to delete ${role}?\nPlease type **Yes** to confirm this change or type anything else to cancel`).setColor(colors.warn)] })
            const filter = m => m.author.id === message.author.id; const collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            collector.on('collect', async (x) => {
                if (x.content.toLowerCase() === 'yes') {
                    role.delete(); i.delete(); message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Deleted the role \`${role.name}\``).setColor(colors.approve)] })
                } else { i.delete(); collector.stop() }
            })
            collector.on('end', async (collected) => {
                if (collected.size === 0) i.delete()
            })
        } else if (args[0] === 'icon') {
                var isUriImage = function(uri) {
                    ui = uri.split('?')[0];
                    var parts = uri.split('.');
                    var extension = parts[parts.length-1];
                    var imageTypes = ['jpg','jpeg','png'];
                    if(imageTypes.indexOf(extension) !== -1) {
                        return true;   
                    } else {
                        return false;
                    }
                }
                const check = await isUriImage(args[1])
                if (check === false) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: URL does not match a **message link** or an **attachment**`).setColor(colors.warn)] })   
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[2].toLowerCase()))
                if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args[2]}**`).setColor(colors.warn)] })
                if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= role.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${role} is **too high** for you to manage`).setColor(colors.warn)] })
                role.edit({ icon : args[1] }); message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Updated your **role icon** to the [provided file](${args[1]})`).setColor(colors.approve)] })
        } else if (args[0] === 'create') {
            if (!args[1]) return;
            let name = args.slice(1).join(' ')
            const regex = /^#([0-9a-f]{3}){1,2}$/i; const check = regex.test(args[1])
            if (check === true) name = args.slice(2).join(' ')
            const role = await message.guild.roles.create({ name : name, color : check === true ? args[1] : null })
            message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: ${check === true ? `Created role ${role} with hex code **${args[1]}**` : `Created role ${role}`}`).setColor(colors.approve)] })
        } else {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase().includes(args[0].toLowerCase()) || member.user.username.toLowerCase().includes(args[0].toLowerCase()) || member.user.tag.toLowerCase().includes(args[0].toLowerCase()))
            if (!member) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a member with the name: **${args.join(' ')}**`).setColor(colors.warn)] })
            if (!args[1]) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Missing a **role** to **add/remove to/from** member`).setColor(colors.warn)] })
            if (args.slice(1).join(' ').split(',').length === 1 || args.slice(1).join(' ').endsWith(',')) {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase()))
                if (!role) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a role with the name: **${args.slice(1).join(' ')}**`).setColor(colors.warn)] })
                if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= role.position) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: ${role} is **too high** for you to manage`).setColor(colors.warn)] })
                if (member.roles.cache.get(role.id)) {
                    await member.roles.remove(role.id); message.channel.send({ embeds : [new MessageEmbed().setDescription(`<:remove:960154552676528138> ${message.author}: Removed ${role} from ${member}`).setColor('36a9e0')] })
                } else if (!member.roles.cache.get(role.id)) {
                    await member.roles.add(role.id); message.channel.send({ embeds : [new MessageEmbed().setDescription(`<:add:960154267140886538> ${message.author}: Added ${role} to ${member}`).setColor('36a9e0')] })
                }
            } else {
                let roles = []
                args.slice(1).join(' ').split(',').forEach(async (string) => {
                    string = string.toString().trim().startsWith('<@&') ? string.replace('<@&', '').replace('>', '').toString().trim() : string.toString().trim() 
                    const role = message.guild.roles.cache.get(string) || message.guild.roles.cache.find((role) => role.name.toLowerCase().includes(string.toLowerCase()))
                    if (role) { roles.push({ role : role.id, check : member.roles.cache.get(role.id) ? 'remove' : 'add' }) }
                })
                let changedRoles = []
                roles.forEach(async (role) => {
                    if (role.check === 'add') {
                        changedRoles.push(`+${message.guild.roles.cache.get(role.role).name}`) 
                        await member.roles.add(role.role);
                    } else if (role.check === 'remove') {
                        changedRoles.push(`-${message.guild.roles.cache.get(role.role).name}`) 
                        await member.roles.remove(role.role)
                    }
                })
                console.log(roles)
                console.log(changedRoles)
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${message.author}: Changed roles for ${member}: **${changedRoles.join(', ')}**`).setColor('36a9e0')] })
            }
        }
    }
}