//controllers
var authController = require('../app/controllers/authController');
var groupController = require('../app/controllers/groupController');
var attendanceController = require('../app/controllers/attendanceController');

// // middleware
var protectAPI = require('../app/middlewares/protectAPI');

const { body, param } = require('express-validator');
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

	// -------------------- Auth Routes --------------------
    app.post('/api/users/auth', 
        [
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Enter a valid email')
                .trim()
                .escape(),
            body('password')
                .notEmpty().withMessage('Password is required')
                .trim()
                .escape()
        ],
        authController.auth
    );

    app.post('/api/users/register', 
        [
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Enter a valid email')
                .trim()
                .escape(),
            body('password')
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters')
                .trim()
                .escape(),
			body('fullName')
				.trim()
				.escape()
				.notEmpty()
				.withMessage('Full name is required'),
            body('roleId').notEmpty().withMessage('Role is required'),
            body('groupId').notEmpty().withMessage('Group is required')
        ],
        authController.register
    );

    app.post('/api/users/add_user', 
        protectAPI,
        [
            body('email').notEmpty()
				.withMessage('Email is required')
				.isEmail().withMessage('Enter a valid email')
				.trim().escape(),
            body('fullName').notEmpty().withMessage('Full name is required').trim().escape(),
            body('mobile').notEmpty().withMessage('Mobile is required').trim().escape(),
            body('groupId').notEmpty().withMessage('Member should be added to a group')
        ],
        authController.add_user
    );
	
	app.get('/api/users/get_user/:id', 
        protectAPI,
        authController.get_user
    );

    app.get('/api/users/get_group_users/:groupId', 
        protectAPI,
        authController.get_group_users
    );

    app.get('/api/users/search/:name/:groupId', 
        protectAPI,
        authController.search
    );

    app.get('/api/users/get_me/:id', 
        protectAPI,
        authController.get_me
    );

	app.post('/api/groups/add_group', protectAPI, groupController.add_group );
	app.get('/api/groups/get_groups', protectAPI, groupController.get_groups );

	app.post('/api/attendances/add_attendance', protectAPI, attendanceController.add_attendance );
	app.get('/api/attendances/get_group_attendance_by_date/:groupId/:today/:tomorrow',  protectAPI, attendanceController.get_group_attendance_by_date );
};