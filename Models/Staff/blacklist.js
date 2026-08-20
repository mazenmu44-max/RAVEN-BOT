const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    client : String , 
    user : String ,
})

module.exports = mongoose.model('blacklists', Schema)