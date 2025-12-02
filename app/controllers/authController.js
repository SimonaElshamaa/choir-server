var jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// var crypto = require('crypto');
// var ejs = require('ejs');
var User = require('../models/user');
var Role = require('../models/role');
// const sendmail = require('sendmail')();


module.exports = {
   auth: async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        title: 'Validation Error', 
        type: 'Validation Error', 
        details: errors.array() 
      });
    }

    try {
      const user = await User.findOne({ email: req.body.email }).populate('roleId').exec();
      if (!user) {
        return res.status(422).json({ 
          state: false, 
          details: 'Authentication failed.', 
          title: 'Authentication failed', 
          type: 'Authentication Error.' 
        });
      }

      const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
      res.json({
        state: true,
        success: 204,
        message: 'Welcome back!',
        data: user,
        token
      });
    } catch (err) {
      res.status(500).json({ title: 'Server Error', type: "Server Error", details: err });
    }
  },

  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        title: 'Validation Error', 
        type: 'Validation Error', 
        details: errors.array() 
      });
    }

    try {
      const role = await Role.findOne({ index: req.body.roleId }).exec();
      if (!role) return res.status(422).json({ title: 'Validation Error', details: 'Role not found', type: 'Validation Error' });

      const signupAttributes = {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName ? req.body.fullName.charAt(0).toUpperCase() + req.body.fullName.slice(1) : '',
        mobile: req.body.mobile,
        address: req.body.address,
        dateBfBirth: req.body.dateOfBirth,
        image: req.body.image,
        note: req.body.note,
        confessionPriest: req.body.confessionPriest,
        church: req.body.church,
        groupId: req.body.groupId,
        fatherMobileNumber: req.body.fatherMobileNumber,
        motherMobileNumber: req.body.motherMobileNumber,
        fatherConfessionPriest: req.body.fatherConfessionPriest,
        motherConfessionPriest: req.body.motherConfessionPriest,
        roleId: role,
        fatherJob: req.body.fatherJob,
        motherJob: req.body.motherJob
      };

      const newUser = new User(signupAttributes);
      const token = jwt.sign({ user: newUser }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
      newUser.token = token;

      await newUser.save();

      if (req.body.file_bytes) {
        newUser.saveImage(req.body.file_bytes, req.body.file_name, newUser.email, async (image_path) => {
          newUser.image = image_path;
          await newUser.save();
          res.json({ status: 204, title: 'User Added', data: newUser, token });
        });
      } else {
        res.json({ status: 204, data: newUser, token });
      }
    } catch (err) {
      let message = err;
      if (err.code === 11000) message = "This email is registered with another account!";
      res.status(422).json({ title: 'Validation Error', type: "duplicate Field", details: message });
    }
  },

  add_user: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        title: 'Input Validation',
        type: 'Validation Error',
        details: errors.array()
      });
    }

    try {
      const signupAttributes = {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName ? req.body.fullName.charAt(0).toUpperCase() + req.body.fullName.slice(1).toLowerCase() : '',
        mobile: req.body.mobile,
        groupId: req.body.groupId,
        address: req.body.address,
        dateBfBirth: req.body.dateOfBirth,
        image: req.body.image,
        note: req.body.note,
        confessionPriest: req.body.confessionPriest,
        church: req.body.church,
        fatherMobileNumber: req.body.fatherMobileNumber,
        motherMobileNumber: req.body.motherMobileNumber,
        fatherConfessionPriest: req.body.fatherConfessionPriest,
        motherConfessionPriest: req.body.motherConfessionPriest,
        fatherJob: req.body.fatherJob,
        motherJob: req.body.motherJob
      };

      const newUser = new User(signupAttributes);
      await newUser.save();

      if (req.body.file_bytes) {
        newUser.saveImage(req.body.file_bytes, req.body.file_name, newUser.email, async (image_path) => {
          newUser.image = image_path;
          await newUser.save();
          res.json({ status: 204, body: newUser });
        });
      } else {
        res.json({ status: 204, data: newUser });
      }
    } catch (err) {
      let message = err;
      if (err.code === 11000) message = "This email is registered with another account!";
      res.status(500).json({ title: 'Server Error', type: "duplicate field", details: message });
    }
  },

  get_user: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id }).populate('user').exec();
      res.json({ status: 204, data: user });
    } catch (err) {
      res.status(500).json({ title: 'Server Error', type: "Server Error", details: err });
    }
  },

  search: async (req, res) => {
    try {
      const fullName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1).toLowerCase();
      const users = await User.find({ fullName, groupId: parseInt(req.params.groupId) }).exec();
      res.json({ status: 204, data: users });
    } catch (err) {
      res.status(500).json({ title: 'Server Error', type: "Server Error", details: err });
    }
  },

  get_group_users: async (req, res) => {
    try {
      const users = await User.find({ groupId: parseInt(req.params.groupId) }).exec();
      if (!users.length) {
        return res.status(422).json({ type: "No Items", title: "No Item Found", details: "This group hasn't any member yet!" });
      }
      res.json({ status: 204, data: users, message: 'All users!' });
    } catch (err) {
      res.status(500).json({ title: 'Server Error', type: "Server Error", details: err });
    }
  },

  get_me: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.decoded.user._id }).populate('roleId').exec();
      res.json({ status: 204, data: user });
    } catch (err) {
      res.status(500).json({ title: 'Server Error', type: "Server Error", details: err });
    }
  }
}