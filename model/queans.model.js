const mongoose = require('mongoose')

const queansSchema =new mongoose.Schema({
    question:String,
    answer:String,
    language:String,
    course:String,
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin'
    },
},{timestamps:true})

module.exports = mongoose.model('queans',queansSchema)