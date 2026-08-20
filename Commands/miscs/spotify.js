const Discord = require("discord.js");
const config = require('../../Data/config.json')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({ clientId: config.spotifyClientId, clientSecret: config.spotifyClientSecret });
module.exports = {
    name: 'spotify',
    description: 'search for a song on spotify',
    usage: ',spotify [song]',
    aliases: ['sp'],
    run: async (client, message, args) => {
        const spotify = new MessageEmbed()
        .setTitle(`,spotify`)
        .setDescription(`search for a song on spotify`)
        .addField(`usage`, `,spotify [song]`)
        .addField(`aliases`, `sp`)
        .setColor(colors.haunt)
        spotifyApi.clientCredentialsGrant().then(
            function (data) {
                spotifyApi.setAccessToken(data.body['access_token']);
                const search = args.slice(0).join(' ')
                if (!search) return message.channel.send({embeds: [spotify]})
                spotifyApi.searchTracks(search)
                    .then(function (data) {
                        try {
                            message.channel.send(data.body.tracks.items[0].external_urls.spotify);
                        } catch (error) {
                            return message.channel.send(`i couldn't find that track on spotify`)
                        }
                    });
            }
        )
    }
}