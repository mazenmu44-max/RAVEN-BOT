module.exports = {
    name: 'find',
    run : async (client, message, args) => {
        const name = args[0]
        if (!name) return;
        let usersArray = [];
        message.guild.members.cache.forEach((member) => {
            if (member.user.username.toLowerCase().startsWith(name.toLowerCase())) {
                usersArray.push({ userTag: `${member.user.tag}`, userId: `${member.user.id}`})
            } else if (member.user.tag.toLowerCase().startsWith(name.toLowerCase())) {
                usersArray.push({ userTag: `${member.user.tag}`, userId: `${member.user.id}`})
            } else if (member.displayName.toLowerCase().startsWith(name.toLowerCase())) {
                usersArray.push({ userTag: `${member.user.tag}`, userId: `${member.user.id}`})
            }
        })
        if (usersArray.length < 1) return message.channel.send('i found no users with that name')
        let andMore = ''
        if (usersArray.length > 2) andMore = `, and ${usersArray.length - 2} more...`
        if (usersArray[1]) return message.channel.send(`i found several people with that name, try using their @​mention or id.. \`${usersArray[0].userTag}\`, \`${usersArray[1].userTag}\`${andMore}`)
        message.channel.send(`I only found one user with that username, \`${usersArray[0].userTag}\``) 
    }
}