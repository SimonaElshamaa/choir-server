const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const timestamps = require('goodeggs-mongoose-timestamps');

const SALT_WORK_FACTOR = 10;
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  password: { type: String, required: true },
  fullName: { type: String, trim: true, required: true },
  address: { type: String, trim: true },
  mobile: { type: Number },
  dateOfBirth: { type: Date },
  image: { type: String },
  note: { type: String },
  confessionPriest: { type: String },
  church: { type: String },
  fatherMobileNumber: { type: Number },
  motherMobileNumber: { type: Number },
  fatherConfessionPriest: { type: String },
  motherConfessionPriest: { type: String },
  fatherJob: { type: String },
  motherJob: { type: String },
  sisters: [{
    name: { type: String, trim: true },
    age: { type: Number }
  }],
  brothers: [{
    name: { type: String, trim: true },
    age: { type: Number }
  }],
  groupId: { type: Number },
  roleId: { type: Schema.Types.ObjectId, ref: 'role', required: true }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add createdAt and updatedAt automatically
userSchema.plugin(timestamps);

module.exports = mongoose.model('user', userSchema);
