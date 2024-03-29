var jwt = require('jsonwebtoken');
// var crypto = require('crypto');
// var ejs = require('ejs');
var User = require('../models/user');
var Role = require('../models/role');
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
            res.status(422).json({title:'Validation Error', type:'Validation Error',details: 'Please enter correct email and password'});
            return;
        }
        User.findOne({email: req.body.email}).populate('roleId').exec(function (err, user) {
            if (err) 
                throw err;
            if (!user) {
                return res.status(422).json({state: false, details: 'Authentication failed.', title:'Authentication failed', type:'Authentication Error.'});
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

        req.checkBody('roleId', 'role is required').notEmpty();  
        req.checkBody('groupId', 'group is required').notEmpty();        

        var errors = req.validationErrors();
        if (errors) {
            res.status(422).json({
                title:'Validation Error',
                details:errors,
                type:'Validation Error'
            });
            return;
        }

        Role.findOne({index:req.body.roleId}).exec((error,role)=>{
            if (error){
                res.status(500).json({title:'Server Error',type:"Server Error", details:error})
            }else{
                var signupAttributes;
                signupAttributes = {
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fullName.charAt(0).toUpperCase() + req.body.fullName.slice(1),
                    mobile: req.body.mobile,
                    address:req.body.address,
                    dateBfBirth: req.body.dateOfBirth,
                    image: req.body.image,
                    note: req.body.note,
                    confessionPriest: req.body.confessionPriest,
                    church: req.body.church,
                    groupId: req.body.groupId,
                    fatherMobileNumber :req.body.fatherMobileNumber,
                    motherMobileNumber :req.body.motherMobileNumber,
                    fatherConfessionPriest: req.body.fatherConfessionPriest,
                    motherConfessionPriest:req.body.motherConfessionPriest,
                    roleId:role,
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
                        res.status(422).json({title:'Validation Error',type:"duplicate Field", details:message});
                        return;
                    }
        
                    if (req.body.file_bytes) {
                        newUser.saveImage(req.body.file_bytes,req.body.file_name, newUser.email, function(image_path){
                            newUser.image = image_path;
                            newUser.save();
                            res.json({  status: 204, title: 'User Added', data:newUser, token:token});
                        });
                    }
                    else{
                        res.json({  status: 204, data:{ data:newUser}});
                    }
                });
            }
        }) 
    },
    add_user: function (req, res) {     
        //validating password
        //validating email
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('fullName', 'fullName is required').notEmpty();
        req.checkBody('mobile', 'mobile is required').notEmpty();
        req.checkBody('groupId', 'Member should be added to group').notEmpty();


        req.sanitizeBody('fullName').escape();
        req.sanitizeBody('fullName').trim();

        req.sanitizeBody('password').escape();
        req.sanitizeBody('password').trim();
        
        

        var errors = req.validationErrors();
        if (errors) {
            res.status(422).json({
                title:'input validation',
                type:'Validation error',
                details: errors
            });
            return;
        }
        var signupAttributes;
        signupAttributes = {
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName.charAt(0).toUpperCase() + req.body.fullName.slice(1).toLowerCase(),
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
                res.status(500).json({title:'Server Error', type:"duplicate field", details: message});
                return;
            }

            if (req.body.file_bytes) {
                newUser.saveImage(req.body.file_bytes,req.body.file_name, newUser.email, function(image_path){
                    newUser.image = image_path;
                    newUser.save();
                    res.json({status: 204, body:newUser});
                });
            }
            else{
                res.json({status: 204, data:newUser});
            }
        });
    },
    get_user:function(req,res){
        User.findOne({_id: req.params.id}).populate('user').exec(function (err, user) {
            if (err){
                res.status(500).json({title:'Server Error',type:"Server Error", details:err})
            }else{
                res.json({status: 204, data: user})
            }
        });  
    },
    search:function(req,res){//search by name
        const FullName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1).toLowerCase();
        User.find({fullName: FullName, groupId:parseInt( req.params.groupId)}).exec(function (err, users) {
            if (err)
            res.status(500).json({title:'Server Error', type:"Server Error", details:err});
            else{
                res.json({ status: 204, data: users})
            }
        });  
    },
    get_group_users:function(req,res){
        User.find({groupId: parseInt(req.params.groupId)}).exec(function(err, users){
            if (err) {
                res.status(422).json({  
                type:"No Items",
                title:"No Item Found",
                details: 'this groups hasn\'nt any member yet!'
            });
            } else {
                res.json({status: 204, data: users, message: 'all users!'});
            }
        })
    },
    get_me:function(req, res){
        // res.json({status: 204, data: req.decoded.user});
        User.findOne({_id: req.decoded.user._id}).populate('roleId').exec(function (err, user) {
            if (err){
                res.status(500).json({title:'Server Error',type:"Server Error", details:err})
            }else{
                res.json({status: 204, data: user})
            }
        });
    }
}