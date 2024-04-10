var adminModel = require('../model/admin.model')
var jwt = require('jsonwebtoken')
const queansModel = require('../model/queans.model')
const path = require('path')

module.exports={
    dashboard:(req,res) => {
        var data = req.user
        res.render('dashboard',{data})
    },
    login(req,res){
        res.render('login')
    },
    loginform:async(req,res)=>{
        var data = await adminModel.findOne({email:req.body.email})
        if(data){
            if(data.password == req.body.password){
                var token = jwt.sign({id:data._id},'devloper')
                res.cookie('token',token)
                res.redirect('/admintable')
            }
            else{
                res.redirect('/login')
            }
        }
        else{
           res.redirect('/login') 
        }
    },
    question:(req,res)=>{
        var user = req.user
        var data =  req.user
        res.render('question',{user,data})
    },
    questionform:async(req,res)=>{
        try {
            // console.log(req.body,req.user);
            req.body.adminId=req.user._id
            req.body.course = req.user.course
        var data = await queansModel.create(req.body);
        if(data){
            res.redirect('/alldata')
        }else{
            res.redirect('back')
        }
        } catch (error) {
            console.log(error);
        }
    },
    alldata:async(req,res)=>{

        var data = await queansModel.find({course:req.user.course}).populate({path:'adminId',model:'admin'})
        //console.log(data);
        res.render('alldata',{data})
    },
    answer:async(req,res)=>{
        var data = await queansModel.findById(req.params.id).populate({path:'adminId',model:'admin'});
        var user = req.user;
        res.render('answer',{data,user})
    },

    answerform:async(req,res) => {
        // console.log(req.body)
        try {
            var data = await queansModel.findByIdAndUpdate(req.params.id,req.body)
            console.log(data)
            res.redirect( '/alldata')
        } catch (err) {
            console.log(err)
        } 
    },
    admintable:async(req,res)=>{
        var admin = await adminModel.find()
        var data =  req.user
        res.render('admintable',{admin,data})
    }, 
    profile:async(req,res)=>{
        var data = req.user
        res.render('profile',{data})
    },
    addprofileform:async(req,res)=>{
        console.log(req.body);
        var data = await adminModel.create(req.body)
        if(data){
            res.redirect('/admintable')
        }else{
            res.redirect('back')
        }
    },
    adminupdate:async(req,res)=>{
        console.log(req.body)
        var data = await adminModel.findById(req.params.id)
        res.render('adminupdate',{data})
    },
    adminupdateform:async(req,res) => {
        var updatedata = await adminModel.findByIdAndUpdate(req.params.id,req.body)
        if(updatedata){
            res.redirect('back')
        }else{  
            res.redirect('back')
        }
    },
  
}
