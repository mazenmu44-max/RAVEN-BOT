const player = require("../../Functions/player");

module.exports = {
    name: "volume",
    description: "change or check the volume of the current song",
    run: async (client, message, args) => {
        const volumePercentage = args.slice(0).join(' ')
        const queue = player.getQueue(message.guild);
        if (!queue?.playing)
            return

        if (!volumePercentage)
            return //interaction.followUp({
                //content: `The current volume is \`${queue.volume}%\``,
           // });

        if (volumePercentage < 0 || volumePercentage > 1000)
            return //interaction.followUp({
               // content: "The volume must be betweeen 1 and 100",
            //});

        queue.setVolume(volumePercentage);

        return message.react('✅')
    },
};