const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    authId:{type:String},
    email:{type:String},
    firstname:{type:String},
    lastname:{type:String},
    password:{type:String , default:""},
    profilepix:{type:String}
})

module.exports = mongoose.model('user', userSchema)
