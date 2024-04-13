var adminModel = require('../model/admin.model')
var jwt = require('jsonwebtoken')
const queansModel = require('../model/queans.model')
const path = require('path')
var nodemailer = require('nodemailer')

module.exports={
    dashboard:(req,res) => {
        var data = req.user
        res.render('dashboard',{data})
    },
    login(req,res){
        res.render('login')
    },
    loginform:async(req,res)=>{
        var data = await adminModel.findOne({
        $and:[{
                email:req.body.email
            },
            {
                name:req.body.name
            }]
        })
        if(data){
            if(data.password == req.body.password){
                var token = jwt.sign({id:data._id},'devloper')
                res.cookie('token',token)
                req.flash('success',"Login Successfully")
                res.redirect('/dashboard')
            }
            else{
                req.flash('error',"Password Dosen't Match")
                res.redirect('/login')
            }
        }
        else{
            req.flash('error',"Email Not Found")
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
            req.flash('success',"Question Added Successfully")
            res.redirect('/alldata')
        }else{
            req.flash('error',"Question Not Added")
            res.redirect('back')
        }
        } catch (error) {
            console.log(error);
        }
    },
    alldata:async(req,res)=>{
        var admindata = await adminModel.find()
        var data = await queansModel.find({course:req.user.course}).populate({path:'adminId',model:'admin'})
        //console.log(data);
        var user = req.user

        res.render('alldata',{data,user,admindata})
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
            req.flash('success','Answered Successfully')
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
            req.flash('success','Profile Added Successfully')
            res.redirect('/admintable')
        }else{
            req.flash('error','Profile Not Added')
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
            req.flash('success','Profile Updated Successfully')
            res.redirect('back')
        }else{  
            req.flash('error','Profile Not Updated')
            res.redirect('back')
        }
    },
    forgotpassword:async(req,res)=>{
        res.render('forgotpassword')
    },
    forgotpasswordform:async(req,res)=>{
        var data = await adminModel.findOne({email:req.body.email})
        // console.log(data);
        try {
            if(data){
                var otp = Math.floor(Math.random()*10000)
                console.log(otp)
                var transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'vishrutimorsy1996@gmail.com',
                        pass: 'vgxxnnhumsnvkdhz'
                    }
                })
                var info = transport.sendMail({
                    to: req.body.email,
                    from: 'vishrutimorsy1996@gmail.com',
                    subject: "otp",
                    html:`<h4><b>otp :- ${otp}</b></h4>`
                })
                var data = await adminModel.findOneAndUpdate({email:req.body.email},{otp})
                res.cookie('email',req.body.email)
                req.flash('success','otp send to your email')
                res.redirect('/otp')

            }else{
                req.flash('error','email not found')
                res.redirect('back')
            }
        } catch (error) {
            console.log(error)
        }
    },
    otp:async(req,res)=>{
        res.render('otp')
    },
    otpform:async(req,res)=>{
        console.log(req.body);
        console.log(req.cookies);
        
        var data = await adminModel.findOne({email:req.cookies.email})
        console.log(data);
        if(req.body.otp == data.otp){
            req.flash('success','otp verified')
            res.redirect('/resetpassword')
        }else{
            req.flash('error','otp not verified')
            res.redirect('back')
        }
    },
    resetpassword:(req,res)=>{
        res.render('resetpassword')
    },
    resetpasswordform:async(req,res)=>{
        console.log(req.body);
        if(req.body.updatepassword == req.body.confirmpassword){
            var data = await adminModel.findOneAndUpdate({email:req.cookies.email},{password:req.body.updatepassword})
            req.flash('success','password updated')
            res.redirect('/login')
        }else{
            req.flash('error',"Both Password Not Matched")
            res.redirect('back')
        }
    }
}
