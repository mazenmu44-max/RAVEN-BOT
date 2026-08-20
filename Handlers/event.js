const { readdirSync } = require("fs");

module.exports = (client) => {

  readdirSync("./Events/").forEach(file => {
    const events = readdirSync(`./Events/`).filter(files => files.endsWith(".js"));

    for (let files of events) {
      let pull = require(`../Events/${files}`);

      if (pull.name) {
        client.events.set(pull.name, pull);
      } else {
        continue;
      }
    }
  })
}