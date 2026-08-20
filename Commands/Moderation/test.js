const ms = require('ms')
const time = ms('24h')
module.exports = {
    name : 'ttt',
    run : async (client, message, args) => {
        let membersArray = []
        message.guild.members.fetch().then(members => {
            const sortedMembers = members.sort((a, b) => a.joinedAt - b.joinedAt).last(parseInt(message.guild.memberCount))
                sortedMembers.forEach((member) => {
                    if (Date.now() - new Date(member.joinedAt).getTime() < time) {
                        membersArray.push(member)
                    }
            })
        })
    }
}