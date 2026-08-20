/*STRIPSTAFF*/

/**
 *
 * @returns Stripstaff
 */

const stripstaff = async (message) => {
    try {
        message.member.roles.cache.forEach((role) => {
            if (role.permissions.has('ADMINISTRATOR')) {
                message.member.roles.remove(role)
            }
            if (role.permissions.has('MANAGE_GUILD')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_CHANNELS')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_ROLES')) {
                message.member.roles.remove(role)
            }
            if (role.permissions.has('MANAGE_EMOJIS_AND_STICKERS')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_WEBHOOKS')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_NICKNAMES')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_MESSAGES')) {
                message.member.roles.remove(role)
            } 
            if (role.permissions.has('MANAGE_THREADS')) {
                message.member.roles.remove(role)
            }
            if (role.permissions.has('KICK_MEMBERS')) {
                message.member.roles.remove(role)
            }
            if (role.permissions.has('BAN_MEMBERS')) {
                message.member.roles.remove(role)
            }
        })
    } catch (e) {
        return;
    }
}
module.exports = stripstaff;