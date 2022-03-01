//controllers
var authController = require('../app/controllers/authController');
var groupController = require('../app/controllers/groupController');
const attendanceController = require('../app/controllers/attendanceController');

// // middleware
var protectAPI = require('../app/middlewares/protectAPI');

var expressValidator = require('express-validator');
var validator = require('../config/validator.js');

// var path = require('path');
// const multer = require("multer");
// var fs = require("fs");

// const crypto = require('crypto');

module.exports = function (app) {
	app.use(expressValidator(validator));
	
	/* add protectAPI to routes like:
	*     app.get('/api_url', protectAPI, controller.method);
	*  except auth and register
	*/
	app.post('/api/users/auth', authController.auth);
	app.post('/api/users/register', authController.register);
	app.get('/api/users/get_user/:id', protectAPI, authController.get_user);
	app.post('/api/users/add_user', protectAPI, authController.add_user);
	app.get('/api/users/get_group_users/:groupId',protectAPI, authController.get_group_users);
	app.get('/api/users/search/:name/:groupId', protectAPI, authController.search);
	app.get('/api/users/get_me/:id', protectAPI, authController.get_me);

	app.post('/api/groups/add_group', protectAPI, groupController.add_group );
	app.get('/api/groups/get_groups', protectAPI, groupController.get_groups );

	app.post('/api/attendances/add_attendance', protectAPI, attendanceController.add_attendance );
	app.get('/api/attendances/get_group_attendance_by_date/:groupId/:today/:tomorrow',  protectAPI, attendanceController.get_group_attendance_by_date );
};