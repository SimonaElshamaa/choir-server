const mongoose = require('mongoose');
const timestamps = require('goodeggs-mongoose-timestamps');

const { Schema } = mongoose;

const attendanceSchema = new Schema({
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  groupId: { type: Number, required: true },
  attend: { type: Boolean, default: false },
  note: { type: String, default: '' }
});

// Automatically add createdAt and updatedAt
attendanceSchema.plugin(timestamps);

module.exports = mongoose.model('attendance', attendanceSchema);
