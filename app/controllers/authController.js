var jwt = require('jsonwebtoken');
// var crypto = require('crypto');
// var ejs = require('ejs');
var User = require('../models/user');
// const sendmail = require('sendmail')();


module.exports = {
    auth: function (req, res) {
        //email validation
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Enter a Valid Email address').isEmail();
        req.sanitizeBody('email').escape();
        req.sanitizeBody('email').trim();
        
        //password validation
        req.checkBody('password', 'Password is required').notEmpty();
        req.assert('password', 'The legnth of the password must be between 6 and 20 characters').len(6, 20);

        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            res.json({state:false, success: 400, message: 'Please enter correct email and password'});
            return;
        }
        User.findOne({email: req.body.email}).exec(function (err, user) {
            if (err) 
                throw err;
            if (!user) {
                return res.json({state: false, status:400, message: 'Authentication failed.'});
            } else {
                var token = jwt.sign({"user": user}, process.env.SECRET, {expiresIn: 60*60*24});
                return res.json({
                    state: true,
                    success: 204,
                    message: 'Welcome back!',
                    data: user,
                    token:token
            });

            }
        });
    },
    register: function (req, res) {     
        //validating password
        //validating email
        req.checkBody('email', 'Email is required').notEmpty();

        req.sanitizeBody('name').escape();
        req.sanitizeBody('name').trim();

        req.checkBody('password', 'Password is required').notEmpty();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('password').trim();
        
        

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json({
                status: false,
                message: errors
            });
            return;
        }
        
        var signupAttributes;
        signupAttributes = {
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName,
            mobile: req.body.mobile,
            address:req.body.address,
            dateBfBirth: req.body.dateOfBirth,
            image: req.body.image,
            note: req.body.note,
            confessionPriest: req.body.confessionPriest,
            church: req.body.church,
            fatherMobileNumber :req.body.fatherMobileNumber,
            motherMobileNumber :req.body.motherMobileNumber,
            fatherConfessionPriest: req.body.fatherConfessionPriest,
            motherConfessionPriest:req.body.motherConfessionPriest,
            fatherJob: req.body.fatherJob,
            motherJob: req.body.motherJob,
        };
        var newUser = new User(signupAttributes);

        var token = jwt.sign({"user": newUser}, process.env.SECRET, {expiresIn: 60*60*24});
        newUser.token = token;
        newUser.save(function (err) {
            if (err) {
                var message = err
                if(err.code == 11000)
                    message = "This email is registered with another account!"
                res.json({state:false, status: 400, message: message});
                return;
            }

            if (req.body.file_bytes) {
                newUser.saveImage(req.body.file_bytes,req.body.file_name, newUser.email, function(image_path){
                    newUser.image = image_path;
                    newUser.save();
                    res.json({state:true, status: 204, message: 'User Added', data:newUser, token:token});
                });
            }
            else{
                res.json({state:true, status: 204, message: 'User Added', data:newUser, token:token});
            }
        });
    },
    add_user: function (req, res) {     
        //validating password
        //validating email
        console.log('hello', req.body);
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('fullName', 'fullName is required').notEmpty();
        req.checkBody('mobile', 'mobile is required').notEmpty();


        req.sanitizeBody('fullName').escape();
        req.sanitizeBody('fullName').trim();

        req.sanitizeBody('password').escape();
        req.sanitizeBody('password').trim();
        
        

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json({
                status: false,
                type:"Validation error",
                details: errors
            });
            return;
        }
        
        var signupAttributes;
        signupAttributes = {
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName,
            mobile: req.body.mobile,
            groupId: req.body.groupId,
            address:req.body.address,
            dateBfBirth: req.body.dateOfBirth,
            image: req.body.image,
            note: req.body.note,
            confessionPriest: req.body.confessionPriest,
            church: req.body.church,
            fatherMobileNumber :req.body.fatherMobileNumber,
            motherMobileNumber :req.body.motherMobileNumber,
            fatherConfessionPriest: req.body.fatherConfessionPriest,
            motherConfessionPriest:req.body.motherConfessionPriest,
            fatherJob: req.body.fatherJob,
            motherJob: req.body.motherJob,
        };
        var newUser = new User(signupAttributes);

        newUser.save(function (err) {
            if (err) {
                var message = err
                if(err.code == 11000)
                    message = "This email is registered with another account!"
                res.json({state:false, status: 400,type:"duplicate field", details: message});
                return;
            }

            if (req.body.file_bytes) {
                newUser.saveImage(req.body.file_bytes,req.body.file_name, newUser.email, function(image_path){
                    newUser.image = image_path;
                    newUser.save();
                    res.json({state:true, status: 204, message: 'User Added', body:newUser});
                });
            }
            else{
                res.json({state:true, status: 204, message: 'User Added', body:newUser});
            }
        });
    },
    get_user:function(req,res){
        console.log('req.params',req.params);
        User.findOne({_id: req.params.id}).populate('user').exec(function (err, user) {
            if (err){
                res.json({state:false, status: 400, message: err})
            }else{
                res.json({state:true, status: 204, data: user})
            }
        });  
    },
    search:function(req,res){//search by name
        console.log('req.params.name',req.params.fullName)
        User.find({fullName: req.params.name, groupId: req.params.groupId}).exec(function (err, users) {
            if (err)
            res.json({state:false, status: 400, message:err});
            else{
                res.json({state:true, status: 204, data: users})
            }
        });  
    },
    get_group_users:function(req,res){
        User.find({group: req.params.groupId}).exec(function(err, users){
            if (err) {
                res.json({state:false, status: 400, message: 'this groups hasn\'nt any member yet!'});
            } else {
                res.json({state:true, status: 204, data: users, message: 'all groups!'});
            }
        })
    }
}