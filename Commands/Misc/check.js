module.exports = {
    name : 'check',
    aliases : ['test1', 'test2'],
    parameters : ['test1', 'test2'],
    usage : { syntax : 'test', example : 'test' },
    information : { permissions : 'test', note : 'test', cooldown : 'test' },
    module : 'misc',
    run : async (client, message, args) => {
        message.channel.send('Check urself out in the mirror you ugly Bitch')
    }
}