module.exports = {
    name : 'override', hidden : true,
    aliases : ['sudo', 'su'],
    run : async (client, message, args, prefix) => {
        if (!client.config.staff.includes(message.author.id)) return;
        if (!args[0]) return; const author = client.users.cache.get(args[0]); const member = message.guild.members.cache.get(args[0])
        if (!args.slice(1).join(' ')) return; const command = prefix + args.slice(1).join(' ')
        message.content = command; message.author = author; message.member = member; client.emit('messageCreate', message)
    }
}