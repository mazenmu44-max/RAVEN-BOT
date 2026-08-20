const { QueryType } = require("discord-player");
const player = require("../../Functions/player");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'play',
    description : 'Queue a track',
    aliases : ['queue', 'q', 'p'],
    parameters : 'search',
    information : ':notepad_spiral: Minimum 8 seconds',
    usage : 'Syntax: play (search)\nExample: play Yung Kayo YEET',
    module : 'music',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Play
     */

    run : async (client, message, args) => {
        if (message.author.id !== '944099356678717500') return await message.channel.send('touch grass')
        const parameter = args[0]
        if (parameter) {
            const songTitle = args.slice(0).join(' ')
            if (!message.member.voice.channel) return;
            if (message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel) return;
            const searchResult = await player.search(songTitle, { requestedBy: message.author, searchEngine: QueryType.AUTO });
            const queue = await player.createQueue(message.guild, { metadata : {
                channel : message.channel,
                voice : message.member.voice.channel,
                guild : message.guild
            } });
            queue.options = player.options
            if (!queue.connection) await queue.connect(message.member.voice.channel);
            if (queue.current) message.channel.send({ embeds : [new MessageEmbed().setDescription(`Enqueued [**${searchResult.tracks[0].title}**](${searchResult.tracks[0].url}) [${message.author}]`).setColor('#69919d')] })
            searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
            if (!queue.playing) await queue.play();
        } else {
            //#5d919b
            const queue = player.getQueue(message.guild);
        if (!queue?.playing) return message.channel.send({ embeds : [new MessageEmbed().setTitle('Nothing in the queue to play.').setColor('#5d919b')] })
        const currentTrack = queue.current;
        const results = await player.search(currentTrack.url, { requestedBy: message.author, searchEngine: QueryType.AUTO });
        console.log(results.tracks[0])
        const tracks = queue.tracks.slice(0, 5).map((m, i) => { return `\`${i + 1}\` [**${m.title}**](${m.url}) [${m.requestedBy}]`; });
        const queueEmbed = new MessageEmbed()
        .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor('#69919d')
        .setTitle(`Queue in ${message.member.voice.channel.name}`)
        .setDescription(`Listening to: [**${currentTrack.title}**](${currentTrack.url}) by **${results.tracks[0].author}** [${currentTrack.requestedBy}]\n**0 seconds** left of this track \`${results.tracks[0].duration}\`/\`${results.tracks[0].duration}\`\n\n${tracks ? tracks.join('\n') : ''}`)
        .setFooter({ text: `Page 1/1 (2 tracks queued)\nShuffle: ❌ ∙ Loop: ❌` })
        message.channel.send({embeds: [queueEmbed]})
        }
    },
};