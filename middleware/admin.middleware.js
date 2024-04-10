const adminModel = require('../model/admin.model')
var jwt = require('jsonwebtoken')

var verifytoken = async(req,res,next) => {
    var token = req.cookies.token
    if(token){
        var verify = jwt.verify(token,"devloper")
        if(verify){
            var data = await adminModel.findById(verify.id)
            if(data){
                req.user = data
                next()
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
}

module.exports = verifytoken