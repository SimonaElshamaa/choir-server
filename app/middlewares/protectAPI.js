const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  try {
    const token = req.body.authorization || req.query.authorization || req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET); // synchronous
    req.decoded = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      state: false,
      success: 200,
      error: err.message || err,
      message: 'Failed to authenticate token.'
    });
  }
};
