/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const dotenv = require('dotenv');
dotenv.config();

var bodyParser = require('body-parser');

const isDev = process.env.NODE_ENV !== 'production';
const app = express();
const cors = require('cors');
app.use(cors({origin : "www.dhattendance.com"}));


//configuring body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//requiring all routes
require('./config/routes')(app);

// database connection
require('./config/db');

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || '127.0.0.1';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
});
