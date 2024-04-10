var express = require('express')
var router = express.Router()
var controller = require('../controller/admin.controller')
var middleware = require('../middleware/admin.middleware')

router.get('/',middleware,controller.dashboard)
router.get('/dashboard',middleware,controller.dashboard)
router.get('/login',controller.login)
router.get('/question',middleware,controller.question)
router.get('/alldata',middleware,controller.alldata)
router.get('/answer/:id',middleware,controller.answer)
router.get('/admintable',middleware,controller.admintable)
router.get('/profile',middleware,controller.profile)
router.get('/adminupdate/:id',middleware,controller.adminupdate)

router.post('/login',controller.loginform)
router.post('/question',middleware,controller.questionform)
router.post('/answer/:id',middleware,controller.answerform)
router.post('/addprofileform',middleware,controller.addprofileform)
router.post('/adminupdate/:id',middleware,controller.adminupdateform)

router.get('/logout',middleware,(req,res)=>{
    res.cookie('token',"")
    res.clearCookie()
    res.redirect('/login')
})

module.exports = router