module.exports = {
    name: 'randomkey',
    run: async (client, message, args) => {
        function makeid() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 60; i++) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text; }
            message.channel.send(`${makeid()}`);
    }
}