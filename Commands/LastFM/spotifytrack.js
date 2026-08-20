const config = require('../../Data/config.json')
const { MessageEmbed } = require('discord.js')
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({ clientId: config.spotifyClientId, clientSecret: config.spotifyClientSecret });

module.exports = {
    name : 'spotifytrack',
    description : 'Finds track results from the Spotify API',
    aliases : ['sptrack'],
    parameters : 'album',
    usage : 'Syntax: spotifytrack <query>\nExample: spotifytrack Lucki Geek Monster',
    module : 'lastfm',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @returns Spotifytrack
     */

    run : async (client, message, args) => {
        const search = args.slice(0).join(' ')
        const spotifytrack = client.commands.get('spotifytrack')
        try {
            const helpSpotifytrack = new MessageEmbed().setAuthor({ name: `raven help`, iconURL: 'https://images-ext-2.discordapp.net/external/Na3IUNk23NZw9faPfnA6OZQcO_QSEXh2436kWce1hS4/https/raven.bot/img/bot_avatar_default.png' }).setTitle(`Command: ${spotifytrack.name}`).setDescription(`${spotifytrack.description}\`\`\`${spotifytrack.usage}\`\`\``).setColor('#718090')
            if (!search) return message.channel.send({ embeds : [helpSpotifytrack] })
            spotifyApi.clientCredentialsGrant().then(function (data) {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.searchTracks(search).then(function (data) {
                    message.channel.send(data.body.tracks.items[0].external_urls.spotify);
                });
            })
        } catch (error) {
            return console.log(error)
        }
    },
};