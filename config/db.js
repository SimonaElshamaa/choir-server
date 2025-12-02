//require mongoose module
var mongoose = require('mongoose');

//require chalk module to give colors to console text
const mongoose = require('mongoose');
const chalk = require('chalk');

// Database URL (use env variable if available)
const dbURL = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/choir';

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

// Avoid deprecation warnings
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(connected(`Mongoose default connection is open to ${dbURL}`));
  } catch (err) {
    console.log(error(`Mongoose default connection has occurred ${err} error`));
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on('disconnected', () => {
  console.log(disconnected("Mongoose default connection is disconnected"));
});

// Handle app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(termination("Mongoose default connection is disconnected due to application termination"));
  process.exit(0);
});

module.exports = connectDB;

