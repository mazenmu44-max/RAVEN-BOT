const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

module.exports = async (client) => {

  readdirSync("./Commands/").forEach(dir => {
    const commands = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith(".js"));

    for (let file of commands) {
      let pull = require(`../Commands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, '✅');
      } else {
        table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
        continue;
      }
      if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
      if (pull.commands && Array.isArray(pull.commands)) pull.commands.forEach(command => { client.subcommands.set(command.name, command)
        if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.subaliases.set(`${pull.name} ${alias}`, command.name))
      })
    }
  });
  setTimeout(() => {
    console.log(table)
  }, 5000)
}