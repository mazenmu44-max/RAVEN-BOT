const fakepermissionsSchema = require('../../Models/fakepermissions')
const listSchema = require('../../Models/fakepermissionslist')
const {
    MessageEmbed
} = require('discord.js')
const colors = {
    approve: '#a5ec77',
    deny: '#ef5f5c',
    warn: '#ffa602',
    blurple: '#6e87c9',
    help: '#718090'
}
const pagination = require('../../Functions/pagination')
const emojis = require('../../Data/emojis.json')
module.exports = {
    name: 'fakepermissions',
    description: 'Set up fake permissions for role through the bot!',
    aliases: ['fakeperms', 'fp'],
    information: `${emojis.warn} Server Owner`,
    usage: 'Syntax: fakepermissions (subcommand) <args>\nExample: fakepermissions grant @everyone manage_messages',
    module: 'servers',
    options: [{
            name: 'fakepermissions list',
            description: 'List all fake permissions',
            parameters: 'role, permission',
            information: `${emojis.warn} Server Owner`,
            usage: 'Syntax: fakepermissions list'

        },
        {
            name: 'fakepermissions add',
            description: 'Grant a fake permission to a role',
            aliases: 'grant',
            parameters: 'role, permission',
            information: `${emojis.warn} Server Owner`,
            usage: 'Syntax: fakepermissions add (role) (permission)\nExample: fakepermissions add @admin manage_channels'
        },
        {
            name: 'fakepermissions remove',
            description: 'Remove a fake permission from a role',
            aliases: 'delete, del',
            parameters: 'role, permission',
            information: `${emojis.warn} Server Owner`,
            usage: 'Syntax: fakepermissions remove (role) (permission)\nExample: fakepermissions remove @admin manage_channels'
        }
    ],
    run: async (client, message, args, Discord) => {
        try {
            const subCommand = args[0]
            const fakepermissionsEmbed = new MessageEmbed().setAuthor({ name: `${client.user.username} help`, iconURL: `${client.user.displayAvatarURL()}` }).setTitle(`Command: fakepermissions`).setDescription(`Set up fake permissions for role through the bot!\n\`\`\`Syntax: fakepermissions (subcommand) <args>\nExample: fakepermissions grant @everyone manage_messages\`\`\``).setColor(colors.help);
            if (!subCommand) return message.channel.send({ embeds: [fakepermissionsEmbed] })
            if (subCommand === 'list') {
                const fakepermissionsData = await listSchema.findOne({ guildId: message.guild.id });
                  if (!fakepermissionsData || fakepermissionsData.guildData.length < 0) return message.channel.send({ embeds: [new MessageEmbed({ description: `:mag_right: ${message.author}: No **fake permissions** have been created!`, color: `#7189da` })] });
              
                  const listOfEmbeds = [];
                  let i = 0;
                  let itemsCount = 0;
              
                  let pagedData = fakepermissionsData.guildData.pager(10);
                  pagedData.forEach((page) => {
                    page.forEach((fakepermissions) => ++itemsCount);
                  });
              
                  pagedData.forEach((page) => {
                    let fp = page.map((fakepermissions) => { return `\`${++i}\` ${fakepermissions.role} (\`${fakepermissions.permission}\`)`; }).join("\n");
                    const fakepermsEmbed = new MessageEmbed()
                      .setAuthor({ name: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                      .setTitle("Fakepermissions")
                      .setColor(message.member.displayHexColor)
                      .setDescription(fp)
                    listOfEmbeds.push(fakepermsEmbed);
                  });
              
                  if (listOfEmbeds.length > 1) { await pagination(message, listOfEmbeds, pagedData.length, itemsCount); } else { return message.channel.send({ embeds: [listOfEmbeds[0]] }); }
            } else if (subCommand === 'add' || subCommand === 'grant') {
                const helpEmbed = new MessageEmbed()
                .setAuthor({ name: `${client.user.username} help`, iconURL: client.user.displayAvatarURL() })
                .setTitle(`Command: fakepermissions add`)
                .setDescription(`Grant a fake permission to a role\n\`\`\`Syntax: fakepermissions add (role) (permission)\nExample: fakepermissions add @admin manage_channels\`\`\``)
                .setColor(`#718090`)
            if (!args[1]) return message.channel.send({embeds: [helpEmbed]})
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            const permission = args[2]
            if (!role) return message.channel.send({
                embeds: [helpEmbed]
            })
            if (!permission) return message.channel.send({
                embeds: [helpEmbed]
            })
            const permissions = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'USE_APPLICATION_COMMANDS', 'REQUEST_TO_SPEAK', 'MANAGE_THREADS', 'CREATE_PUBLIC_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS', 'START_EMBEDDED_ACTIVITIES']
            if (!permissions.includes(permission.toUpperCase())) {
                const permissionEmbed2 = new MessageEmbed()
                .setDescription(`${emojis.deny} ${message.author}: **Invalid** permission passed! View the **documentation** [here](https://docs.raven.bot/help/contents#list-of-fake-permissions-available).`)
                .setColor(colors.deny)
                return message.channel.send({embeds: [permissionEmbed2]})
            } else {
                const permissiondata = await fakepermissionsSchema.findOne({
                    role: role.id,
                    permission: permission.toUpperCase()
                })
                if (permissiondata) {
                    const alreadyexistingEmbed = new MessageEmbed()
                    .setDescription(`${emojis.warn} ${message.author}: **Fake permission** \`${permission}\` already exists for ${role}`)
                    .setColor(colors.warn)
                    return message.channel.send({embeds: [alreadyexistingEmbed]})
                } else if (!permissiondata) {
                    const newdata = new fakepermissionsSchema({
                        role: role.id,
                        permission: permission.toUpperCase()
                    })
                    newdata.save();
                    const successEmbed = new MessageEmbed()
                    .setDescription(`${emojis.approve} ${message.author}: Granted **fake permission** \`${permission}\` for ${role}`)
                    .setColor(colors.approve)
                    message.channel.send({embeds: [successEmbed]})
                    const listData = await listSchema.findOne({ guildId: message.guild.id });
                    if (!listData) {
                        let item = {};
                        item.guildId = message.guild.id
                        item.guildData = [{ role: `${role}`, permission: permission.toUpperCase() },];
                        let newData = await listSchema.create(item);
                        newData.save();
                      } else if (listData) {
                        listData.guildData.push({ role: `${role}`, permission: permission.toUpperCase() });
                        await listSchema.findOneAndUpdate({ guildId: message.guild.id, }, listData);
                      }
                }
            }
            } else if (subCommand === 'remove' || subCommand === 'delete' || subCommand === 'del') {

            }
        } catch (error) {
            console.log(`${error}`)
            const errorEmbed = new MessageEmbed().setDescription(`${emojis.warn} Error occurred while performing command **fakepermissions**. Try again later.`).setColor(colors.warn).setFooter({ text: `${error}` })
            return message.channel.send({ embeds: [errorEmbed] })
        }
    }
}