// Schemas for VoiceMaster
const voicemasterSchema = require('../../Models/VoiceMaster/configuration')
const channels = require('../../Models/voicemaster')

// Make the embeds look good
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const colors = require('../../Data/colors.json')
const emojis = require('../../Data/emojis.json')
const config = require('../../Data/config.json')

// Help
const setupObject = {
    name: 'voicemaster setup',
    description: 'Begin VoiceMaster server configuration setup',
    information: `${emojis.warn} Manage Guild`,
    usage: 'Syntax: voicemaster setup'
}
const permitObject = {
    name: 'voicemaster permit',
    description: 'Permit a member or role to join your VC',
    aliases: ['allow'],
    parameters: 'arg',
    usage: `Syntax: voicemaster permit (member or role)\nExample: voicemaster permit ${config.ownertag}`
}
const limitObject = {
    name: 'voicemaster limit',
    description: 'Set a member limit to your voice channel',
    parameters: 'limit',
    usage: 'Syntax: voicemaster limit (limit)\nExample: voicemaster limit 3'
}
const resetObject = {
    name: 'voicemaster reset',
    description: 'Reset server configuration for VoiceMaster',
    aliases: ['resetserver'],
    information: `${emojis.warn} Manage Guild`,
    usage: 'Syntax: voicemaster reset'
}
const lockObject = {
    name: 'voicemaster lock',
    description: 'Lock your voice channel',
    usage: 'Syntax: voicemaster lock'
}
const nameObject = {
    name: 'voicemaster name',
    description: 'Rename your voice channel',
    aliases: ['rename'],
    parameters: 'new_name',
    usage: 'Syntax: voicemaster name (new name)\nExample: voicemaster name priv channel'
}
const configObject = {
    name: 'voicemaster configuration',
    description: 'See current configuration for current Voice Channel',
    aliases: ['show', 'view', 'config'],
    usage: 'Syntax: voicemaster configuration'
}
const roleObject = {
    name: 'voicemaster role',
    description: 'Grant roles to members who join and remove from members leaving',
    aliases: ['roles'],
    parameters: 'role',
    information: `${emojis.warn} Manage Roles`,
    usage: 'Syntax: voicemaster role (role)\nExample: voicemaster role listening party'
}
const activityObject = {
    name: 'voicemaster activity',
    description: 'Create an activity in your voice chat',
    parameters: 'activity',
    usage: 'Syntax: voicemaster activity (youtube, fishington, poker, betrayal, chess)\nExample: voicemaster activity youtube'
}
const claimObject = {
    name: 'voicemaster claim',
    description: 'Claim an inactive voice channel',
    usage: 'Syntax: voicemaster claim'
}
const ghostObject = {
    name: 'voicemaster ghost',
    description: 'Hide your voice channel',
    aliases: ['hide'],
    information: `${emojis.warn} Donator Only`,
    usage: 'Syntax: voicemaster ghost'
}
const unlockObject = {
    name: 'voicemaster unlock',
    description: 'Unlock your voice channel',
    usage: 'Syntax: voicemaster unlock'
}
const rejectObject = {
    name: 'voicemaster reject',
    description: 'Reject a member or role from joining your VC',
    aliases: ['remove'],
    parameters: 'arg',
    usage: `Syntax: voicemaster reject (member or role)\nExample: voicemaster reject ${config.ownertag}`
}
const bitrateObject = {
    name: 'voicemaster bitrate',
    description: 'Edit bitrate of your voice channel',
    parameters: 'bitrate',
    usage: 'Syntax: voicemaster bitrate (bitrate)\nExample: voicemaster bitrate 80'
}
const unghostObject = {
    name: 'voicemaster unghost',
    description: 'Unhide your voice channel',
    aliases: ['unhide'],
    information: `${emojis.warn} Donator Only`,
    usage: 'Syntax: voicemaster unghost'
}
const categoryObject = {
    name: 'voicemaster category',
    description: 'Redirect voice channels to custom category',
    parameters: 'channel',
    information: `${emojis.warn} Manage Guild`,
    usage: 'Syntax: voicemaster category (channel)\nExample: voicemaster category 925940351850647554'
}

// Start of module
const { help } = require('../../Functions/Embeds/help.js')
module.exports = {
    name: 'voicemaster',
    description: 'Make temporary voice channels in your server!',
    aliases: ['voice', 'vm', 'vc'],
    usage: 'Syntax: voicemaster (subcommand) <args>\nExample: voicemaster setup',
    module: 'voicemaster',
    pages: [setupObject, permitObject, limitObject, resetObject, lockObject, nameObject, configObject, roleObject, activityObject, claimObject, ghostObject, unlockObject, rejectObject, bitrateObject, unghostObject, categoryObject],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns VoiceMaster
     */

    run: async (client, message, args, prefix) => {
        const command = args[0]
        const commands = ['setup', 'permit', 'allow', 'limit', 'reset', 'resetserver', 'lock', 'name', 'rename', 'configuration', 'show', 'view', 'config', 'role', 'roles', 'activity', 'claim', 'ghost', 'hide', 'unlock', 'reject', 'remove', 'bitrate', 'unghost', 'unhide', 'category']
        try {

            if (!command || !commands.includes(command)) return await new help(message, prefix).send('voicemaster', 'Make temporary voice channels in your server!', 'voicemaster (subcommand) <args>', 'voicemaster setup')
            if (command === 'setup') {
                if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\``).setColor(colors.warn)]});
                const alreadyConfigured = await voicemasterSchema.findOne({ guildId : message.guild.id, });
                if (alreadyConfigured) { return message.channel.send({embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Server is already configured for **VoiceMaster**, run \`voicemaster reset\` to reset the **VoiceMaster** server configuration`).setColor(colors.warn)]}); } else if (!alreadyConfigured) {
                    const category = await message.guild.channels.create(`Voice Channels`, { type: "GUILD_CATEGORY"});
                    const jointocreate = await message.guild.channels.create(`Join to Create`, { type: "GUILD_VOICE", parent: category.id, });
                    const interface = await message.guild.channels.create(`interface`, { type: "GUILD_TEXT", parent: category.id, });
                    interface.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { SEND_MESSAGES: false })
                    interface.send({ embeds: [new MessageEmbed()
                        //.setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true })})
                        .setTitle(`VoiceMaster Controls`)
                        .setColor(colors.color)
                        .setDescription('Interact with the button interface below to control your voice channel!')
                        .addField('Buttons', `<:lock:969669442516705311> — [**Lock**](https://discord.gg/Ct52UDvuR6) the voice channel\n<:unlock:969669442571223050> — [**Unlock**](https://discord.gg/Ct52UDvuR6) the voice channel\n<:ghost:969669442546069696> — [**Ghost**](https://discord.gg/Ct52UDvuR6) the voice channel\n<:reveal:969669442659307530> — [**Reveal**](https://discord.gg/Ct52UDvuR6) the voice channel\n<:microphone:969669442550259733> — [**Claim**](https://discord.gg/Ct52UDvuR6) the voice channel\n<:hammer:969669442923556954> — [**Disconnect**](https://discord.gg/Ct52UDvuR6) a member\n<:computer:969669442718040084> — [**Start**](https://discord.gg/Ct52UDvuR6) a new voice channel activity\n<:info:969669442390872075> — [**View**](https://discord.gg/Ct52UDvuR6) channel information\n<:plus:969669442550247434> — [**Increase**](https://discord.gg/Ct52UDvuR6) the user limit\n<:minus:969669442546040842> — [**Decrease**](https://discord.gg/Ct52UDvuR6) the user limit`, true)], components: [new MessageActionRow().addComponents(
                            new MessageButton().setCustomId("interface_lock").setEmoji(`<:lock:969669442516705311>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_unlock").setEmoji(`<:unlock:969669442571223050>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_ghost").setEmoji(`<:ghost:969669442546069696>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_unghost").setEmoji(`<:reveal:969669442659307530>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_claim").setEmoji(`<:microphone:969669442550259733>`).setStyle("SECONDARY"), ), new MessageActionRow().addComponents(
                            new MessageButton().setCustomId("interface_disconnect").setEmoji(`<:hammer:969669442923556954>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_activity").setEmoji(`<:computer:969669442718040084>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_info").setEmoji(`<:info:969669442390872075>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_increase").setEmoji(`<:plus:969669442550247434>`).setStyle("SECONDARY"), 
                            new MessageButton().setCustomId("interface_decrease").setEmoji(`<:minus:969669442546040842>`).setStyle("SECONDARY"), )]})
                    new voicemasterSchema({ guildId: message.guild.id, channel: jointocreate.id, category : category.id, default_category : category.id }).save();
                    return message.channel.send({ embeds: [new MessageEmbed().setDescription(`**VoiceMaster** has been linked to ${jointocreate}`).setColor(colors.color).setFooter({ text : `You can rename the channels or move them if you want.` })] });
                }//bleеd
            } else if (command === 'permit') {

                if (!args[1]) return await new help(message, prefix).send('voicemaster permit', 'Permit a member or role to join your VC', 'voicemaster permit (member or role)', `voicemaster permit ${config.ownertag}`)
            
            } else  if (command=== 'reset') {
                message.member.permissions.has("MANAGE_GUILD") ? 
                await voicemasterSchema.findOne({ guildId : message.guild.id }) !== null ? 
                await voicemasterSchema.findOneAndDelete({ guildId : message.guild.id }).then(() => message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Reset the **VoiceMaster** configuration`).setColor(colors.approve)] })) : 
                message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: Server is not configured in the **database**, you need to run \`,voicemaster setup\` to be able to run this command`).setColor(colors.warn)] }) : message.channel.send({embeds: [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\``).setColor(colors.warn)]});}
            else if (command === 'category') {
                if (args[1]) {
                    const category = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((c) => c.type == 'GUILD_CATEGORY' && c.name.includes(args[1]))
                    if (!category || category.type !== 'GUILD_CATEGORY') return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: I was unable to find a channel with the name: **${args[1]}**`).setColor(colors.warn)] })
                    await voicemasterSchema.findOne({ guildId : message.guild.id }).then(async(data) => {
                        if (!data) {
                            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set **${category.name}** as the default voice channel category`).setColor(colors.approve)] })
                        } else {
                            await voicemasterSchema.findOneAndUpdate({ guildId : message.guild.id, category : data.category }, { guilId : message.guild.id, category : category.id })
                            return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set **${category.name}** as the default voice channel category`).setColor(colors.approve)] })
                        }
                    })
                } else {
                    await voicemasterSchema.findOne({ guildId : message.guild.id }).then(async(data) => {
                        if (!data || data.category == data.default_category) return message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: No **category** set - set it by passing a category's ID`).setColor(colors.warn)] })
                        await voicemasterSchema.findOneAndUpdate({ guildId : message.guild.id, category : data.category }, { guilId : message.guild.id, category : data.default_category })
                        message.channel.send({ embeds : [new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: Set **category** back to default`).setColor(colors.approve)] })
                    })
                }
            }
        } catch (error) {
            console.log(`${error}`)
            const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **voicemaster**. Try again later.`).setColor(colors.warn).setFooter({
                text: `${error}`
            })
            return message.channel.send({
                embeds: [errorEmbed]
            })
        }
    }
}