var mongoose = require ('mongoose')
var db = mongoose.connection

mongoose.connect('mongodb://127.0.0.1/nodejs-project')

db.once("open",(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Db connected...");
    }
})