const client = require('../bleed');
const voicemasterSchema = require('../Models/voicemaster');
const VoiceMaster = require('../Models/voicemaster');
const voiceconfigSchema = require('../Models/voiceconfig')

const { Collection } = require("discord.js");
const ms = require('ms')
const Discord = require('discord.js')
const config = require('../Data/config.json')
const { Database } = require('quickmongo');
const Cooldown = new Collection();
const emojis = require('../Data/emojis.json')

// VOICEMASTER (JOIN TO CREATE) FUNCTION
client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        if (!newState) return;
        if (!newState.member) return
        const voiceData = await voiceconfigSchema.findOne({
            guildId: newState.guild.id
        })
        if (!voiceData) return;
        const voicemasterChannel = await client.channels.cache.get(voiceData.channel)
        if (newState.channel.id !== voicemasterChannel.id) {
            return;
        } else {
            console.log(newState.member.user.id)
            if (Cooldown.has(`VoiceMaster_${voicemasterChannel.id}`)) return newState.member.user.send({ embeds : [new Discord.MessageEmbed({ description: `${emojis.cooldown} ${newState.member.user}: Please wait **${ms(Cooldown.get(`VoiceMaster_${voicemasterChannel.id}`) - Date.now(), { long: true })}** before creating a new VoiceMaster channel`, color: `#51c4f0`})]}).catch(() => {}).then(async(x) => {
                await newState.member.voice.setChannel(null, 'voicemaster')
                setTimeout(() => {
                    x.delete()
                }, 20000)
            })
            Cooldown.set(`VoiceMaster_${voicemasterChannel.id}`, Date.now() + 8500)
              setTimeout(() => {
                Cooldown.delete(`VoiceMaster_${voicemasterChannel.id}`)
              }, 8500)
                const channel = await newState.guild.channels.create(`${oldState.member.user.username}'s channel`, { type: 'GUILD_VOICE', parent: newState.channel.parent, });
                await newState.member.voice.setChannel(channel, 'voicemaster')
                new VoiceMaster({ channel: `${channel.id}`, owner: `${newState.member.id}` }).save()
        }
    } catch (error) {
        return console.log(error)
    }
})

// VOICEMASTER (LEAVE) FUNCTION
client.on('voiceStateUpdate', async (oldState, newState) => {
    // Start of function
    try {
        // Return if there is no oldState since the oldState is a user LEAVING a voice channel
        if (!oldState.channel) return;
        if (!oldState.member) return;
        // Find the channel in the VoiceMaster database
        const voicemasterData = await voicemasterSchema.findOne({ channel: oldState.channel.id })
        if (voicemasterData) {    
            // Check if the newState is in the same channel
            if (newState && newState.member && newState.member.selfDeaf) return;
            if (newState && newState.member && newState.member.selfMute) return;
            if (newState && newState.member && newState.member.selfVideo) return;
            if (newState && newState.member && newState.member.streaming) return;
            if (newState && newState.member && newState.member.serverDeaf) return;
            if (newState && newState.member && newState.member.serverMute) return;
            if (newState && newState.channel && newState.channel.id === oldState.channel.id) return;
            // Check if the channel isn't deleted
            if (client.channels.cache.get(voicemasterData.channel)) {
                // Check if the member who left the channel is the owner of it
                if (voicemasterData.owner && oldState.member.id === voicemasterData.owner) {
                    // Find the data, then update it without an owner set so VoiceMaster claim can add a new owner
                    const filterData = { channel: voicemasterData.channel, owner: voicemasterData.owner };
                    const updatedStatus = { channel: voicemasterData.channel, owner: 'None' };
                    const optionsNew = { new: true };
                    // Replace the owner (member who left the vc) with "None" so we can replace none with the new owner
                    await VoiceMaster.findOneAndReplace(filterData, updatedStatus)
                } else {
                    // Return since the member who left the vc is not the owner
                    return;
                } 
            } else {
                // Return since the channel was either deleted or can't be found
                return;
            } 
        } else if (!voicemasterData) {
            // Return since the oldState.channel is not a VoiceMaster channel
            return;
        } 
    } catch (error) {
        // Return & log the error we found
        return console.log(`${error}`);
    }
    // End of function
})
// VOICEMASTER (DELETE) FUNCTION
client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        if (!oldState) return;
        const voicemaster = await voicemasterSchema.findOne({
            channel: oldState.channel.id
        })
        if (!voicemaster) return;
        const channel = await client.channels.cache.get(voicemaster.channel)
        if (channel.members.size < 1) {
            if (!client.channels.cache.get(channel.id)) return;
            return channel.delete()
        }
    } catch (error) {
        return
    }
})