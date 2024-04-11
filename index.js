var express = require('express');
const path = require('path');
var app = express()
app.use(express.urlencoded())
app.set('view engine','ejs')
const cookieParser = require('cookie-parser')
const adminModel = require('./model/admin.model')

app.set(express.static(path.join(__dirname,"views")))
app.use(express.static(path.join(__dirname,"assets")))
require('./mongoose')
app.use(cookieParser())
var session = require('express-session')
app.use(session({
    secret:"developer",
    cookie:{
        maxAge:2000
    }
}))
var flash = require('express-flash')
app.use(flash())

app.use('/',require('./router/admin.router'))

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server is Connected...");
    }
})