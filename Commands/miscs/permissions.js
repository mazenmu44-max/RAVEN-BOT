module.exports = {
    name: 'permissions',
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member
        let allowed = []
        let denied = []
        const sp = member.permissions.serialize();
        //const permissions = Object.keys(sp).map(perm => [ sp[perm] ? 'true - ' : 'false -', perm.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ') ].join(' ')).join('\n')
        const permissions = Object.keys(sp).map(perm => [ sp[perm], perm.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ') ].join(' ')).join('\n')
        permissions.forEach((permission) => {
            if (permission.startsWith('true')) {
                allowed.push(`${permission}`)
            } else {
                denied.push(`${permission}`)
            }
        })
        message.channel.send(`**Allowed perms**\n${allowed.join('\n')}`)
        message.channel.send(`**denied perms**\n${denied.join('\n') || 'n/a'}`)
    }
}