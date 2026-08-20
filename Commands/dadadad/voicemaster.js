const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const voiceconfigSchema = require("../../Models/voiceconfig");
const voicemasterSchema = require("../../Models/voicemaster");
const voicecategorySchema = require("../../Models/voicemaster");
const emojis = require("../../Data/emojis.json");
const config = require("../../Data/config.json");
const setupObject = { name: 'voicemaster setup', description: 'Begin VoiceMaster server configuration setup', information: `${emojis.warn} Manage Guild`, usage: 'Syntax: voicemaster setup' }
const permitObject = { name: 'voicemaster permit', description: 'Permit a member or role to join your VC', aliases: 'allow', parameters: 'arg', usage: 'Syntax: voicemaster permit (member or role)\nExample: voicemaster permit nick឵#1337' }
const limitObject = { name: 'voicemaster limit', description: 'Set a member limit to your voice channel', parameters: 'limit', usage: 'Syntax: voicemaster limit (limit)\nExample: voicemaster limit 3' }
const resetObject = { name: 'voicemaster reset', description: 'Reset server configuration for VoiceMaster', aliases: 'resetserver', information: `${emojis.warn} Manage Guild`, usage: 'Syntax: voicemaster reset' }
const lockObject = { name: 'voicemaster lock', description: 'Lock your voice channel', usage: 'Syntax: voicemaster lock' }
const nameObject = { name: 'voicemaster name', description: 'Rename your voice channel', aliases: 'rename', parameters: 'new_name', usage: 'Syntax: voicemaster name (new name)\nExample: voicemaster name priv channel' }
const configObject = { name: 'voicemaster configuration', description: 'See current configuration for current Voice Channel', aliases: 'show, view, config', usage: 'Syntax: voicemaster configuration' }
const roleObject = { name: 'voicemaster role', description: 'Grant roles to members who join and remove from members leaving', aliases: 'roles', parameters: 'role', information: `${emojis.warn} Manage Roles`, usage: 'Syntax: voicemaster role (role)\nExample: voicemaster role listening party' }
const activityObject = { name: 'voicemaster activity', description: 'Create an activity in your voice chat', parameters: 'activity', usage: 'Syntax: voicemaster activity (youtube, fishington, poker, betrayal, chess)\nExample: voicemaster activity youtube' }
const claimObject = { name: 'voicemaster claim', description: 'Claim an inactive voice channel', usage: 'Syntax: voicemaster claim' }
const ghostObject = { name: 'voicemaster ghost', description: 'Hide your voice channel', aliases: 'hide', information: `${emojis.warn} Donator Only`, usage: 'Syntax: voicemaster ghost' }
const unlockObject = { name: 'voicemaster unlock', description: 'Unlock your voice channel', usage: 'Syntax: voicemaster unlock' }
const rejectObject = { name: 'voicemaster reject', description: 'Reject a member or role from joining your VC', aliases: 'remove', parameters: 'arg', usage: 'Syntax: voicemaster reject (member or role)\nExample: voicemaster reject nick឵#1337' }
const bitrateObject = { name: 'voicemaster bitrate', description: 'Edit bitrate of your voice channel', parameters: 'bitrate', usage: 'Syntax: voicemaster bitrate (bitrate)\nExample: voicemaster bitrate 80' }
const unghostObject = { name: 'voicemaster unghost', description: 'Unhide your voice channel', aliases: 'unhide', information: `${emojis.warn} Donator Only`, usage: 'Syntax: voicemaster unghost' }
const categoryObject = { name: 'voicemaster category', description: 'Redirect voice channels to custom category', parameters: 'channel', information: `${emojis.warn} Manage Guild`, usage: 'Syntax: voicemaster category (channel)\nExample: voicemaster category 925940351850647554' }
module.exports = {
    name: 'voicemasadadadter',
    description: 'Make temporary voice channels in your server!',
    aliases: ['vadadadoice', 'vadadadm', 'voicechannel'],
    usage: 'Syntax: voicemaster (subcommand) <args>\nExample: voicemaster setup',
    module: 'servers',
    options: [setupObject, permitObject, limitObject, resetObject, lockObject, nameObject, configObject, roleObject, activityObject, claimObject, ghostObject, unlockObject, rejectObject, bitrateObject, unghostObject, categoryObject],
    run: async (client, message, args) => {
        const sub = args[0];
        const voicemasterEmbed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.username} help`,
                iconURL: `${client.user.displayAvatarURL()}`,
            })
            .setTitle(`Command: voicemaster`)
            .setDescription(
                `Make temporary voice channels in your server!\n\`\`\`Syntax: ,voicemaster (subcommand) <args>\nExample: ,voicemaster setup\`\`\``
            )
            .setColor(`#718090`);
        if (!sub) return message.channel.send({
            embeds: [voicemasterEmbed]
        });
        if (sub === "setup") { // Setup function (remaking later)
            const permissionsEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\``
                )
                .setColor(`#ffa602`);
            if (!message.member.permissions.has("MANAGE_GUILD"))
                return message.channel.send({
                    embeds: [permissionsEmbed]
                });
            const voiceData = await voiceconfigSchema.findOne({
                guildId: message.guild.id,
            });
            const alreadysetupEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: Server is already configured for **VoiceMaster**,\n run \`voicemaster reset\` to reset the **VoiceMaster** server configuration`
                )
                .setColor(`#ffa602`);
            if (voiceData)
                return message.channel.send({
                    embeds: [alreadysetupEmbed]
                });
            const setupEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.approve} ${message.author}: Finished setting up the **VoiceMaster** channels. A category and new channel have been created, you can move the channel or rename if you want.`
                )
                .setColor(`#a3eb7b`);
            const newCategory = await message.guild.channels.create(
                `Voice Channels`, {
                    type: "GUILD_CATEGORY"
                }
            );
            const newChannel = await message.guild.channels.create(`Join to Create`, {
                type: "GUILD_VOICE",
                parent: newCategory.id,
            });
            const interface = await message.guild.channels.create(`interface`, {
                type: "GUILD_TEXT",
                parent: newCategory.id,
            });
            const interfaceButtons = new MessageActionRow().addComponents(new MessageButton().setCustomId("interface_lock").setEmoji(`<:b_lock:946073358372581428>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_unlock").setEmoji(`<:b_unlock:946073358636838952>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_ghost").setEmoji(`<:b_ghost:946073359073034260>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_unghost").setEmoji(`<:b_unghost:946073358800416789>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_claim").setEmoji(`<:b_microphone:946073358708121630>`).setStyle("SECONDARY"),);
            const interfaceButtons2 = new MessageActionRow().addComponents(new MessageButton().setCustomId("interface_disconnect").setEmoji(`<:b_hammer:946073358594879498>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_activity").setEmoji(`<:b_computer:946073357902839879>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_info").setEmoji(`<:b_info:946073358364192818>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_increase").setEmoji(`<:b_plus:946073358326456340>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_decrease").setEmoji(`<:b_minus:946073359593136158>`).setStyle("SECONDARY"),);  
            const interfaceEmbed = new MessageEmbed().setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) }).setTitle(`VoiceMaster Interface`).setColor('#648c9c').setDescription('Click the buttons below to control your voice channel').addField(`**Button Usage**`, `<:b_lock:946073358372581428> — [\`Lock\`](https://discord.gg/raven) the voice channel\n<:b_unlock:946073358636838952> — [\`Unlock\`](https://discord.gg/raven) the voice channel\n<:b_ghost:946073359073034260> — [\`Ghost\`](https://discord.gg/raven) the voice channel\n<:b_unghost:946073358800416789> — [\`Reveal\`](https://discord.gg/raven) the voice channel\n<:b_microphone:946073358708121630> — [\`Claim\`](https://discord.gg/raven) the voice channel\n<:b_hammer:946073358594879498> — [\`Disconnect\`](https://discord.gg/raven) a member\n<:b_computer:946073357902839879> — [\`Start\`](https://discord.gg/raven) a new voice channel activity\n<:b_info:946073358364192818> — [\`View\`](https://discord.gg/raven) channel information\n<:b_plus:946073358326456340> — [\`Increase\`](https://discord.gg/raven) the user limit\n<:b_minus:946073359593136158> — [\`Decrease\`](https://discord.gg/raven) the user limit`, true).setThumbnail(client.user.displayAvatarURL())
            interface.send({ embeds: [interfaceEmbed], components: [interfaceButtons, interfaceButtons2] })
            const newData = await new voiceconfigSchema({
                guildId: message.guild.id,
                channel: newChannel.id,
            });
            newData.save();
            return message.channel.send({
                embeds: [setupEmbed]
            });
        } else if (sub === "reset" || sub === "resetserver") { // Reset function (remaking later)
            const permissionsEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\``
                )
                .setColor(`#ffa602`);
            if (!message.member.permissions.has("MANAGE_GUILD"))
                return message.channel.send({
                    embeds: [permissionsEmbed]
                });
            const voiceData = await voiceconfigSchema.findOne({
                guildId: message.guild.id,
            });
            if (voiceData) {
                await voiceconfigSchema.findOneAndRemove({
                    guildId: message.guild.id
                });
                const resetEmbed = new MessageEmbed()
                    .setDescription(
                        `${emojis.approve} ${message.author}: Reset the **VoiceMaster** configuration`
                    )
                    .setColor(`#a3eb7b`);
                return message.channel.send({
                    embeds: [resetEmbed]
                });
            } else if (!voiceData) {
                const notresetEmbed = new MessageEmbed()
                    .setDescription(
                        `${emojis.warn} ${message.author}: **VoiceMaster** hasn't been setup in this server yet,\n run \`voicemaster setup\` to setup the **VoiceMaster** server configuration`
                    )
                    .setColor(`#ffa602`);
                return message.channel.send({
                    embeds: [notresetEmbed]
                });
            }
        } else if (sub === "category") { // Category function (remaking later)
            const permissionsEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: You're **missing** permission: \`manage_guild\``
                )
                .setColor(`#ffa602`);
            if (!message.member.permissions.has("MANAGE_GUILD"))
                return message.channel.send({
                    embeds: [permissionsEmbed]
                });
            const categoryEmbed = new MessageEmbed()
                .setAuthor({
                    name: `${client.user.username} help`,
                    iconURL: `${client.user.displayAvatarURL()}`,
                })
                .setTitle(`,voicemaster category (category id)`)
                .setDescription(`Redirect voice channels to custom category`)
                .setColor(`#a1b0bd`);
            if (!args[1]) return message.channel.send({
                embeds: [categoryEmbed]
            });
            const channel = await client.channels.cache.get(args[1]);
            const channelEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: I'm unable to find a channel with the id: **${args[1]}**`
                )
                .setColor(`#ffa602`);
            if (!channel) return message.channel.send({
                embeds: [channelEmbed]
            });
            const errorEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: **${channel.name}** is not a category channel`
                )
                .setColor(`#ffa602`);
            if (channel.type !== "GUILD_CATEGORY")
                return message.channel.send({
                    embeds: [errorEmbed]
                });
            const categoryData = await voicecategorySchema.findOne({
                guildId: message.guild.id,
            });
            if (categoryData) {
                const newcategoryEmbed = new MessageEmbed()
                    .setDescription(
                        `${emojis.approve} ${message.author}: I will now redirect **VoiceMaster** channels to **${channel.name}**`
                    )
                    .setColor(`#a3eb7b`);
                await voicecategorySchema.findOneAndRemove({
                    guildId: message.guild.id,
                });
                const newCategory = new voicecategorySchema({
                    guildId: message.guild.id,
                    category: channel.id,
                });
                newCategory.save();
                return message.channel.send({
                    embeds: [newcategoryEmbed]
                });
            } else if (!categoryData) {
                const newcategoryEmbed = new MessageEmbed()
                    .setDescription(
                        `${emojis.approve} ${message.author}: I will now redirect **VoiceMaster** channels to **${channel.name}**`
                    )
                    .setColor(`#a3eb7b`);
                const newCategory = new voicecategorySchema({
                    guildId: message.guild.id,
                    category: channel.id,
                });
                newCategory.save();
                return message.channel.send({
                    embeds: [newcategoryEmbed]
                });
            }
        } else if (sub === "info") { // Info function
            try {
                const voiceChannel = await message.member.voice.channel
                if (!voiceChannel) {
                    // No voice channel detected
                    const novoiceChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're not connected to a **voice channel**!`).setColor(`#ffa602`)
                    return message.channel.send({ embeds: [novoiceChannel] })
                } else if (voiceChannel) {
                    // Voice channel detected, now getting this channel in the database
                    const voiceData = await voicemasterSchema.findOne({ channel: voiceChannel.id })
                    if (!voiceData) {
                        // The members channel isn't a VoiceMaster channel
                        const notavoicemasterChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **${voiceChannel.name}** is not a VoiceMaster channel`).setColor(`#ffa602`)
                        return message.channel.send({ embeds: [notavoicemasterChannel] })
                    } else if (voiceData) {
                        // Grab information about the channel and send it
                        if (voiceData.owner && voiceData.owner === 'None') {
                            // If the channel has no owner
                            const voiceOwner = `Unknown (\`N/A\`)`
                            let voiceLocked = `${emojis.deny}`
                            if (voiceChannel.permissionsFor(message.guild.id).has("CONNECT") === false) voiceLocked = `${emojis.approve}`
                            let voiceLimit = ''
                            if (voiceChannel.userLimit && voiceChannel.userLimit > 0) voiceLimit = `/\`${voiceChannel.userLimit}\``
                            const voiceInformation = new MessageEmbed()
                            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                            .setTitle(`${voiceChannel.name}`)
                            .setDescription(`**Owner**: ${voiceOwner}\n**Locked**: ${voiceLocked}\n**Created**: <t:${Math.floor(voiceChannel.createdTimestamp / 1000)}:R>\n**Bitrate**: ${voiceChannel.bitrate}\n**Connected**: \`${voiceChannel.members.size}\`${voiceLimit}`)
                            .setColor(`#6e89d1`)
                            return message.channel.send({ embeds: [voiceInformation] })
                        } else if (voiceData.owner) {
                            // If the channel has a owner
                            const ownerInfo = client.users.cache.get(voiceData.owner)
                            const voiceOwner = `${ownerInfo.tag} (\`${ownerInfo.id}\`)`
                            let voiceLocked = `${emojis.deny}`
                            if (voiceChannel.permissionsFor(message.guild.id).has("CONNECT") === false) voiceLocked = `${emojis.approve}`
                            let voiceLimit = ''
                            if (voiceChannel.userLimit && voiceChannel.userLimit > 0) voiceLimit = `/\`${voiceChannel.userLimit}\``
                            const voiceInformation = new MessageEmbed()
                            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                            .setTitle(`${voiceChannel.name}`)
                            .setDescription(`**Owner**: ${voiceOwner}\n**Locked**: ${voiceLocked}\n**Created**: <t:${Math.floor(voiceChannel.createdTimestamp / 1000)}:R>\n**Bitrate**: ${voiceChannel.bitrate}\n**Connected**: \`${voiceChannel.members.size}\`${voiceLimit}`)
                            .setColor(`#6e89d1`)
                            return message.channel.send({ embeds: [voiceInformation] })
                        }
                    }
                }
            } catch (error) {
                const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **info**. Try again later.`).setColor(`#ffa602`).setFooter({ text: `${error}` })
                return message.channel.send({ embeds: [errorEmbed] })
            }
        } else if (sub === "lock") { // Lock function
            try {
                // Try to get the authors voice channel
                const voiceChannel = await message.member.voice.channel
                if (!voiceChannel) {
                    // No voice channel detected
                    const novoiceChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're not connected to a **voice channel**!`).setColor(`#ffa602`)
                    return message.channel.send({ embeds: [novoiceChannel] })
                } else if (voiceChannel) {
                    // Voice channel detected, now getting this channel in the database
                    const voiceData = await voicemasterSchema.findOne({ channel: voiceChannel.id })
                    if (!voiceData) {
                        // The members channel isn't a VoiceMaster channel
                        const notavoicemasterChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **${voiceChannel.name}** is not a VoiceMaster channel`).setColor(`#ffa602`)
                        return message.channel.send({ embeds: [notavoicemasterChannel] })
                    } else if (voiceData) {
                        // The members channel is a VoiceMaster channel, now we lock it
                        if (message.author.id === voiceData.owner) {
                            try {
                                // Lock the voicechannel
                                const lockedEmbed = new MessageEmbed().setColor("#faa61b").setDescription(`:lock: ${message.author}: Your **voice channel** has been locked.`);
                                message.channel.send({embeds: [lockedEmbed]})
                                voiceChannel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { CONNECT: false } );
                            } catch (e) {
                                // Return if we catch an error 
                                return;
                            }
                        } else if (message.author.id !== voiceData.owner) {
                            // Return since the message author doesn't own the voice channel
                            const noVoice = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You don't own a **voice channel**!`).setColor(`#ffa602`);
                            return message.channel.send({embeds: [noVoice]})
                        }
                    }
                }
            } catch (error) {
                const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **voicemaster lock**. Try again later.`).setColor(`#ffa602`).setFooter({ text: `${error}` })
                return message.channel.send({ embeds: [errorEmbed] })
            }
        } else if (sub === "unlock") { // Unlock function
            try {
                // Try to get the authors voice channel
                const voiceChannel = await message.member.voice.channel
                if (!voiceChannel) {
                    // No voice channel detected
                    const novoiceChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're not connected to a **voice channel**!`).setColor(`#ffa602`)
                    return message.channel.send({ embeds: [novoiceChannel] })
                } else if (voiceChannel) {
                    // Voice channel detected, now getting this channel in the database
                    const voiceData = await voicemasterSchema.findOne({ channel: voiceChannel.id })
                    if (!voiceData) {
                        // The members channel isn't a VoiceMaster channel
                        const notavoicemasterChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **${voiceChannel.name}** is not a VoiceMaster channel`).setColor(`#ffa602`)
                        return message.channel.send({ embeds: [notavoicemasterChannel] })
                    } else if (voiceData) {
                        // The members channel is a VoiceMaster channel, now we unlock it
                        if (message.author.id === voiceData.owner) {
                            try {
                                //  the voicechannel
                                const unlockedEmbed = new MessageEmbed().setColor("#faa61b").setDescription(`:unlock: ${message.author}: Your **voice channel** has been unlocked.`);
                                message.channel.send({embeds: [unlockedEmbed]})
                                voiceChannel.permissionOverwrites.edit(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() === "@everyone"), { CONNECT: true } );
                            } catch (e) {
                                // Return if we catch an error 
                                return;
                            }
                        } else if (message.author.id !== voiceData.owner) {
                            // Return since the message author doesn't own the voice channel
                            const noVoice = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You don't own a **voice channel**!`).setColor(`#ffa602`);
                            return message.channel.send({embeds: [noVoice]})
                        }
                    }
                }
            } catch (error) {
                const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **voicemaster unlock**. Try again later.`).setColor(`#ffa602`).setFooter({ text: `${error}` })
                return message.channel.send({ embeds: [errorEmbed] })
            }
        } else if (sub === "name" || sub === "rename") { // Name function
            const newname = args.slice(1).join(' ')
            const voiceChannel = message.member.voice.channel;
            const notconnectedEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: You must be **connected** to a voice channel!`
                )
                .setColor(`#ffa602`);
            if (!voiceChannel)
                return message.channel.send({
                    embeds: [notconnectedEmbed]
                });
            const voiceData = await voicemasterSchema.findOne({
                channel: voiceChannel.id,
            });
            const notavoicechannelEmbed = new MessageEmbed()
                .setDescription(
                    `${emojis.warn} ${message.author}: **${voiceChannel.name}** is not a VoiceMaster channel`
                )
                .setColor(`#ffa602`);
            if (!voiceData)
                return message.channel.send({
                    embeds: [notavoicechannelEmbed]
                });
            if (voiceData.owner && voiceData.owner !== "unknown") {
                const notownerEmbed = new MessageEmbed()
                    .setDescription(
                        `${emojis.warn} ${message.author}: You don't own this **voice channel**!`
                    )
                    .setColor(`#ffa602`);
                const channel = await client.channels.cache.get(voiceData.channel);
                if (message.author.id !== voiceData.owner)
                    return message.channel.send({
                        embeds: [notownerEmbed]
                    });
                if (!newname) return;
                const renamedVC = new MessageEmbed().setColor('#a5ec77').setDescription(`${emojis.approve} ${message.author}: Your **voice channel** has been renamed to \`${newname}\``)
                try {
                    await channel.edit({
                        name: `${newname}`
                    })
                } catch (e) {
                    return message.channel.send(`rate limited L`)
                }
                message.channel.send({
                    embeds: [renamedVC]
                })
            } else if (voiceData.owner === "unknown") {
                const notclaimedEmbed = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You don't own a **voice channel**!`).setColor(`#ffa602`);
                return message.channel.send({
                    embeds: [notclaimedEmbed]
                });
            } else if (!voiceData.owner) {
                return;
            }
        } else if (sub === "limit") {

        } else if (sub === "permit") {

        } else if (sub === "reject") {

        } else if (sub === "claim") {
            try {
                const voiceChannel = await message.member.voice.channel
                if (!voiceChannel) {
                    // No voice channel detected
                    const novoiceChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You're not connected to a **voice channel**!`).setColor(`#ffa602`)
                    return message.channel.send({ embeds: [novoiceChannel] })
                } else if (voiceChannel) {
                    // Voice channel detected, now getting this channel in the database
                    const voiceData = await voicemasterSchema.findOne({ channel: voiceChannel.id })
                    if (!voiceData) {
                        // The members channel isn't a VoiceMaster channel
                        const notavoicemasterChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: **${voiceChannel.name}** is not a VoiceMaster channel`).setColor(`#ffa602`)
                        return message.channel.send({ embeds: [notavoicemasterChannel] })
                    } else if (voiceData) {
                        // The members channel is a VoiceMaster channel, now getting the owner of the channel
                        if (voiceData.owner === 'None') {
                            // New owner of the channel
                            await voicemasterSchema.findOneAndRemove({ channel: voiceChannel.id })
                            const newOwner = new voicemasterSchema({ channel: voiceChannel.id, owner: message.author.id })
                            await newOwner.save()
                            const younowownthisChannel = new MessageEmbed().setDescription(`${emojis.approve} ${message.author}: You are now the owner of this **channel**!`).setColor(`#a5ec77`)
                            return message.channel.send({ embeds: [younowownthisChannel] })
                        } else if (voiceData.owner) {
                            if (message.author.id !== voiceData.owner) {
                                // The owner is still active in the channel
                                const ownerisstillActive = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You can't claim this **voice channel**, the owner is still active here.`).setColor(`#ffa602`)
                                return message.channel.send({embeds: [ownerisstillActive]})
                            } else if (message.author.id === voiceData.owner) {
                                // The member already owns the channel
                                const youalreadyownthisChannel = new MessageEmbed().setDescription(`${emojis.warn} ${message.author}: You already have **ownership** of this voice channel!`).setColor(`#ffa602`)
                                return message.channel.send({embeds: [youalreadyownthisChannel]})
                            }
                        }
                    }
                }
            } catch (error) {
                const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **claim**. Try again later.`).setColor(`#ffa602`).setFooter({ text: `${error}` })
                return message.channel.send({ embeds: [errorEmbed] })
            }
        } else if (sub === "ghost") {} else if (sub === "unghost") {} else if (sub === 'interface') {
            const interfaceButtons = new MessageActionRow().addComponents(new MessageButton().setCustomId("interface_lock").setEmoji(`<:b_lock:946073358372581428>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_unlock").setEmoji(`<:b_unlock:946073358636838952>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_ghost").setEmoji(`<:b_ghost:946073359073034260>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_unghost").setEmoji(`<:b_unghost:946073358800416789>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_claim").setEmoji(`<:b_microphone:946073358708121630>`).setStyle("SECONDARY"),);
            const interfaceButtons2 = new MessageActionRow().addComponents(new MessageButton().setCustomId("interface_disconnect").setEmoji(`<:b_hammer:946073358594879498>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_activity").setEmoji(`<:b_computer:946073357902839879>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_info").setEmoji(`<:b_info:946073358364192818>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_increase").setEmoji(`<:b_plus:946073358326456340>`).setStyle("SECONDARY"), new MessageButton().setCustomId("interface_decrease").setEmoji(`<:b_minus:946073359593136158>`).setStyle("SECONDARY"),);  
            const interfaceEmbed = new MessageEmbed().setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) }).setTitle(`VoiceMaster Interface`).setColor('#648c9c').setDescription('Click the buttons below to control your voice channel').addField(`**Button Usage**`, `<:b_lock:946073358372581428> — [\`Lock\`](https://discord.gg/raven) the voice channel\n<:b_unlock:946073358636838952> — [\`Unlock\`](https://discord.gg/raven) the voice channel\n<:b_ghost:946073359073034260> — [\`Ghost\`](https://discord.gg/raven) the voice channel\n<:b_unghost:946073358800416789> — [\`Reveal\`](https://discord.gg/raven) the voice channel\n<:b_microphone:946073358708121630> — [\`Claim\`](https://discord.gg/raven) the voice channel\n<:b_hammer:946073358594879498> — [\`Disconnect\`](https://discord.gg/raven) a member\n<:b_computer:946073357902839879> — [\`Start\`](https://discord.gg/raven) a new voice channel activity\n<:b_info:946073358364192818> — [\`View\`](https://discord.gg/raven) channel information\n<:b_plus:946073358326456340> — [\`Increase\`](https://discord.gg/raven) the user limit\n<:b_minus:946073359593136158> — [\`Decrease\`](https://discord.gg/raven) the user limit`, true).setThumbnail(client.user.displayAvatarURL())
            message.channel.send({ embeds: [interfaceEmbed], components: [interfaceButtons, interfaceButtons2] })
        }
    },
};