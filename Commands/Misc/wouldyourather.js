const wyr = require('wyr').default
module.exports = {
    name : 'wouldyourather',
    description : 'Would you rather?',
    aliases : ['wyr'],
    parameters : 'choose',
    usage : 'Syntax: wouldyourather <option1> <option2> (not required)\nExample: wouldyourather kiss a dog, kiss a cat',
    module : 'misc',
    run : async (client, message, args) => {
        const result = await wyr()
        message.channel.send(`**Would you rather:**\n:a: ${result.blue.question}\n**OR**\n:b: ${result.red.question}`).then((x) => {
            x.react('🅰️')
            x.react('🅱️')
        })
    }
}