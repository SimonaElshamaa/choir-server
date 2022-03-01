// var apiRoutes = express.Router();
var jwt = require('jsonwebtoken');

//verify token middleware
module.exports = function(req, res, next) {
	var token = req.body.authorization || req.query.authorization || req.headers['authorization'];
	if (token) {
		jwt.verify(token, process.env.SECRET, function(err, decoded) {
			if (err) {
				return res.json({state: false, success: 200, error: err, message: 'Failed to authenticate token.'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};