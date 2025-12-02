const mongoose = require('mongoose');
const timestamps = require('goodeggs-mongoose-timestamps');

const { Schema } = mongoose;

const groupSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

// Automatically add createdAt and updatedAt
groupSchema.plugin(timestamps);

module.exports = mongoose.model('group', groupSchema);
