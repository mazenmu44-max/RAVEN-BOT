const config = require('../Data/config.json')
const emojis = require('../Data/emojis.json')

// Boosterrole
var brRemove = { name : 'boosterrole remove', description : 'Remove custom color booster role', aliases : ['delete', 'del'], information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole remove', }
var brIcon = { name : 'boosterrole icon', description : 'Set a icon for booster role', parameters : 'url', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole icon (icon)\nExample: boosterrole icon url_Goes_here', }
var brList = { name : 'boosterrole list', description : 'View all booster roles', aliases : ['view'], information : `${emojis.warn} Manage Guild`, usage : 'Syntax: boosterrole list', }
var brDominant = { name : 'boosterrole dominant', description : 'Set booster roles color to the most dominant color in avatar', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole dominant', }
var brRename = { name : 'boosterrole rename', description : 'Edit your booster roles name', parameters : 'new_name', information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole rename (new name)\nExample: boosterrole rename boss role'}
var brRandom = { name : 'boosterrole random', description : 'Set a booster role with a random hex code', aliases : ['randomhex'], information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole random', }

async () => {
    var brRemove = { name : 'boosterrole remove', description : 'Remove custom color booster role', aliases : ['delete', 'del'], information : `${emojis.warn} Booster Only`, usage : 'Syntax: boosterrole remove', }
}