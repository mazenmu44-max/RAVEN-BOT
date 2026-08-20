const { readdirSync } = require("fs");

module.exports = (client) => {

  readdirSync("./subcommands/LastFM/").forEach(file => {
    const events = readdirSync(`./subCommands/LastFM/`).filter(files => files.endsWith(".js"));

    for (let files of events) {
      let pull = require(`../subCommands/LastFM/${files}`);

      if (pull.name) {
        client.lastfm.set(pull.name, pull);
      } else {
        continue;
      }
    }
  })
}