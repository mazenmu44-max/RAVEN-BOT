const client = require('../bleed')
const { Database } = require('quickmongo');
const config = require('../Data/config.json')
const db = new Database(config.mongoURI, `vanitystatuses`);
const { MessageEmbed } = require('discord.js')
const presenceInStatus = require('../Models/presence')
const vanity = require('../Models/Misc/vanity')

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  await vanity.findOne({ guild : newPresence.guild.id }).then(async(data)=>{
    if (!data || !data.substring) return;
    const member = newPresence.member
    if (!member || !member.presence) return;
    const activities = member.presence.activities[0];
    if (activities && activities.state && (activities.state.includes(`/${data.substring}`) || activities.state.includes(`/${data.substring}`))) { 
      const presenceInStatusTrue = await presenceInStatus.findOne({ guild : newPresence.guild.id, member : newPresence.user.id })
      if (presenceInStatusTrue) return;
      new presenceInStatus({ guild : newPresence.guild.id, member : newPresence.user.id }).save()
      if (data.awardChannel && data.message) {
        let message = data.message.check ? data.message.message.toString() : data.message.toString()  

        message = message.replace('{user}', newPresence.user.tag)
        message = message.replace('{user.mention}', newPresence.member)
        message = message.replace('{user.name}', newPresence.user.username)
        message = message.replace('{user.tag}', newPresence.user.discriminator)
        message = message.replace('{user.avatar}', newPresence.user.displayAvatarURL({ dynamic : true, size : 1024 }))
       // message = message.replace('{user.guild_avatar}')
        //message = message.replace('{user.display_avatar}')
        //message = message.replace('{user.joined_at}')
        //message = message.replace('{user.created_at}')
        message = message.replace('{user.display_name}', newPresence.member.displayName)
        message = message.replace('{user.boost}', newPresence.member.premiumSinceTimestamp != null ? 'Yes' : 'No')
        //message = message.replace('{user.boost_since}')
        message = message.replace('{user.color}', newPresence.member.displayHexColor)
        message = message.replace('{user.top_role}', newPresence.member.roles.highest.name || 'N/A')
        //message = message.replace('{user.role_list}')
        message = message.replace('{user.bot}', newPresence.user.bot ? 'Yes' : 'No')
        //message = message.replace('{user.badges_icons}')
        //message = message.replace('{user.badges}')
        //message = message.replace('{user.join_position}')
        //message = message.replace('{user.join_position_suffix}')

        message = message.replace('{guild.name}', newPresence.guild.name)
        message = message.replace('{guild.count}', newPresence.guild.memberCount)
        message = message.replace('{guild.region}', newPresence.guild.voice)
        //message = message.replace('{guild.id}')
       // message = message.replace('{guild.shard}')
        //message = message.replace('{guild.owner_id}')
        //message = message.replace('{guild.created_at}')
      //  ////message = message.replace('{guild.emoji_count}')
       // message = message.replace('{guild.role_count}')
       // message = message.replace('{guild.boost_count}')
      //  message = message.replace('{guild.boost_tier}')
      //  message = message.replace('{guild.preferred_locale}') 
      //  message = message.replace('{guild.key_features}')
      //  message = message.replace('{guild.icon}')
       // message = message.replace('{guild.banner}')
       // message = message.replace('{guild.splash}')
      //  message = message.replace('{guild.discovery}')
      //  message = message.replace('{guild.max_presences}')
      //  message = message.replace('{guild.max_members}')
      //  message = message.replace('{guild.max_video_channel_users}')
      //  message = message.replace('{guild.afk_timeout}')
      //  message = message.replace('{guild.afk_channel}')
      //  message = message.replace('{guild.channels}')
     //   message = message.replace('{guild.channels_count}')
     //   message = message.replace('{guild.voice_channels}')
     //   message = message.replace('{guild.voice_channels_count}')
     //   message = message.replace('{guild.category_channels}')
      //  message = message.replace('{guild.category_channels_count}')
        
      ///  message = message.replace('{channel.name}')
      //  message = message.replace('{channel.id}')
      //  message = message.replace('{channel.topic}') 
      //  message = message.replace('{channel.mention}')
      //  message = message.replace('{channel.type}')    
       /// message = message.replace('{channel.category_id}')
      //  message = message.replace('{channel.category_name}')
       // message = message.replace('{channel.position}')
       // message = message.replace('{channel.slowmode_delay}')

        try {
          newPresence.guild.channels.cache.get(data.awardChannel).send({embeds:[json]})
        } catch (e) {
          newPresence.guild.channels.cache.get(data.awardChannel).send(`${message}`)
        }
      }
      if (data.logChannel) client.channels.cache.get(data.logChannel).send({ embeds : [new MessageEmbed().setAuthor({ name : `${newPresence.user.tag} has vanity in the custom status (${newPresence.user.id})`, iconURL : newPresence.user.displayAvatarURL({dynamic:true}) }).setColor('#39c672')] })
      if (data.awardRoles) {
        data.awardRoles.forEach((role) => {
          newPresence.members.roles.add(role.role)
        })
      }
    } else {
      if (data.awardRoles) {
        data.awardRoles.forEach((role) => {
          if (newPresence.member.roles.cache.get(role.role)) {
            newPresence.member.roles.remove(role.role)
          }
        })
          await presenceInStatus.findOne({ guild : newPresence.guild.id, member : newPresence.user.id }).then(async(d) => {
            if (d) {
              await presenceInStatus.findOneAndRemove({ guild : newPresence.guild.id, member : newPresence.user.id })
              if (data.logChannel) client.channels.cache.get(data.logChannel).send({ embeds : [new MessageEmbed().setAuthor({ name : `${newPresence.user.tag} no longer has vanity in the custom status (${newPresence.user.id})`, iconURL : newPresence.user.displayAvatarURL({ dynamic : true })}).setColor('#ed4634')] })
            }
          })
      }
    }
  })
});