var mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    mobileNumber: String,
    img:String,
    course:String,
    otp:String
},{timestamps:true})

module.exports = mongoose.model('admin',adminSchema)