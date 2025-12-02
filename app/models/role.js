const mongoose = require('mongoose');
const timestamps = require('goodeggs-mongoose-timestamps');

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

// Automatically add createdAt and updatedAt
roleSchema.plugin(timestamps);

module.exports = mongoose.model('role', roleSchema);
