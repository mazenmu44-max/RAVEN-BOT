const client = require('../bleed');
const reactionhistorySchema = require('../Models/Moderation/reactionhistory')
// Reaction History Event
client.on('messageReactionRemove', async (messageReaction, user) => {
    try {
        const reactionhistoryData = await reactionhistorySchema.findOne({ messageId: messageReaction.message.id });
        if (!reactionhistoryData) {
            let historyItem = {};
            historyItem.messageId = messageReaction.message.id
            historyItem.reactionsHistory = [{ author: user.tag, reaction: messageReaction.emoji.id === null ? messageReaction.emoji.name : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`, type: 'remove' }];
            let newhistoryItem = await reactionhistorySchema.create(historyItem);
            newhistoryItem.save();
        } else if (reactionhistoryData) {
            reactionhistoryData.reactionsHistory.push({ author: user.tag, reaction: messageReaction.emoji.id === null ? messageReaction.emoji.name : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`, type: 'remove' },);
            await reactionhistorySchema.findOneAndUpdate({ messageId: messageReaction.message.id, }, reactionhistoryData);
        }
    } catch (error) {
        return console.log(error)
    }
})

client.on('messageReactionRemove', async (messageReaction, user) => {
    if (messageReaction.message.id === '969145953598717952') {
      if (messageReaction.emoji.name === '☑️') {
        const role = messageReaction.message.guild.roles.cache.get('969144318638043136')
        const member = messageReaction.message.guild.members.cache.get(user.id)
        await member.roles.remove(role.id)
      }
    }
  })