module.exports = {
    name: "getinvite",
    aliases: ['portal', 'createinvite', 'createportal', 'getinv'],
    run: async (client, message, args) => {
        if (message.author.id !== '944099356678717500') return;
        const guild = client.guilds.cache.get(args[0]);
        if (guild) { guild.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY" && channel.type !== "GUILD_VOICE").first().createInvite( false, 84600, 0, false).catch(error => { return message.channel.send(error) }).then(invite => message.channel.send(`https://discord.gg/${invite.code}`)) } else { return message.channel.send("N/A"); };
    }
};