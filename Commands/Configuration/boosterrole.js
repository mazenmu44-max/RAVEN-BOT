const boosterroleSchema = require('../../Models/Servers/boosterrole')
const baseroleSchema = require('../../Models/Servers/baserole')
const colors = require('../../Data/colors.json')
const { MessageEmbed } = require('discord.js')
const pagination = require('../../Functions/reactionPagination')
module.exports = {
    name : 'boodadaddadadsterrole',
    description : 'manage your custom booster role',
    usage : `boosterrole (hex code)`,
    example : `boosterrole #ff0000`,
    aliases : ['boosadadatrole', 'bdadar'],
    options : 'hex code',
    module : 'configuration',
    timeout : 2000,
    subcommands: [
        {
            name : 'boosterrole icon',
            description : 'set a icon on your booster role',
            usage : `boosterrole icon (image url)`,
            aliases : 'image',
            options : 'image url',
        },
        {
            name : 'boosterrole remove',
            description : 'delete your booster role',
            usage : `boosterrole remove`,
            aliases : 'delete, del'
        },
        {
            name : 'boosterrole rename',
            description : 'rename your booster role',
            usage : `boosterrole rename (new name)`,
            example : `boosterrole rename nick`,
            aliases : 'name',
            options : 'new name'
        },
        {
            name : 'boosterrole random',
            description : 'set your booster role color to a random hex code',
            usage : `boosterrole random`,
            aliases: 'randomhex'
        }
    ],
    run : async (client, message, args) => {

        const subCommand = args[0]

        const subCommands = ['icon', 'image', 'remove', 'delete', 'del', 'rename', 'name', 'random', 'randomhex']

        if (subCommand) {

            if (!subCommands.includes(subCommand)) {
            
            } else if (subCommand === 'icon' || subCommand === 'image') {

            } else if (subCommand === 'remove' || subCommand === 'delete' || subCommand === 'del') {

            } else if (subCommand === 'rename' || subCommand === 'name') {

            } else if (subCommand === 'random' || subCommand === 'randomhex') {

            }

        } else {
            const command = client.commands.get('boosterrole') 
            let arrayOfEmbeds = []
            var aliases = 'N/A'
            if (command.aliases) aliases = command.aliases.join(', ')
            const cmd = new MessageEmbed().setColor(`#a1b0bd`).setTitle(`**,${command.name}**`).setDescription(`${command.description || ''}\`\`\`— syntax: ${command.usage || 'N/A'}\n— example: ${command.example || 'N/A'}\`\`\``).addField(`**aliases**`, `${aliases || 'N/A'}`, true).addField(`**options**`, `${command.options || 'N/A'}`, true).addField(`**details**`, `${command.details || 'N/A'}`, true)
            arrayOfEmbeds.push(cmd)
            for (const subcommand of command.subcommands) {
                const push = new MessageEmbed().setColor(`#a1b0bd`).setTitle(`**,${subcommand.name}**`).setDescription(`${subcommand.description}\`\`\`— syntax: ${subcommand.usage || 'N/A'}\n— example: ${subcommand.example || 'N/A'}\`\`\``).addField(`**aliases**`, `${subcommand.aliases || 'N/A'}`, true).addField(`**options**`, `${subcommand.options || 'N/A'}`, true).addField(`**details**`, `${subcommand.details || 'N/A'}`, true)
                arrayOfEmbeds.push(push)
            }
            await pagination(message, arrayOfEmbeds, arrayOfEmbeds.length, arrayOfEmbeds.length, `module: ${command.module} ∙ `)
        }
    }
}