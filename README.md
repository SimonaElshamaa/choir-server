Choir Management System

A simple backend application to manage users, groups, and attendance for a choir. Built with Node.js, Express, MongoDB, and JWT authentication.

Table of Contents

Features

Tech Stack

Installation

Environment Variables

API Endpoints

Contributing

License

Features

User registration and authentication with JWT

Role-based user management

Group creation and management

Track attendance for users in specific groups

Search users by name within groups

Secure API routes with token authentication

Tech Stack

Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT, bcrypt

Validation: express-validator

Other: Goodeggs mongoose timestamps

Installation

Clone the repository:

git clone https://github.com/your-username/choir-management.git


Navigate into the project directory:

cd choir-management


Install dependencies:

npm install


Create a .env file in the root directory (see below for variables)

Start the server:

npm start


The API will run at:

http://localhost:3000

Environment Variables

Create a .env file with the following:

DB_HOST=localhost
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=choir
DB_PORT=27017
PORT=3000
SECRET=your_jwt_secret
HOST_NAME=localhost
DB_CONNECTION_STRING=mongodb://localhost:27017/choir

API Endpoints
Users
Method	Endpoint	Description
POST	/api/users/register	Register a new user
POST	/api/users/auth	Login and get JWT token
GET	/api/users/get_user/:id	Get a user by ID
POST	/api/users/add_user	Add a user (protected)
GET	/api/users/get_group_users/:groupId	Get all users in a group (protected)
GET	/api/users/search/:name/:groupId	Search users by name in a group (protected)
GET	/api/users/get_me/:id	Get the currently authenticated user (protected)
Groups
Method	Endpoint	Description
POST	/api/groups/add_group	Add a new group (protected)
GET	/api/groups/get_groups	Get all groups (protected)
Attendance
Method	Endpoint	Description
POST	/api/attendances/add_attendance	Add or update attendance (protected)
GET	/api/attendances/get_group_attendance_by_date/:groupId/:today/:tomorrow	Get attendance for a group between two dates (protected)

Note: Protected routes require a valid JWT token in the Authorization header.

Contributing

Fork the repository

Create your feature branch:

git checkout -b feature/AmazingFeature


Commit your changes:

git commit -m "Add some AmazingFeature"


Push to the branch:

git push origin feature/AmazingFeature


Open a Pull Request

License

This project is licensed under the MIT License - see the LICENSE
 file for details.

✅ Optional: You can also add screenshots, API testing examples (Postman), or live demo instructions if you deploy it later.