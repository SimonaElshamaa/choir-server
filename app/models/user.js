var mongoose = require('mongoose');
var timestamps = require('goodeggs-mongoose-timestamps');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
// var fs = require('fs');
var schema = mongoose.Schema;

var userSchema = new schema({
    id: {type: String},
	email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password:{type: String},
    full_name: {type: String},
    address: {type: String},
    mobile:{type: Number},
    date_of_birth: Date,
    image: {type: String},
    note: {type: String},
    confession_priest: {type: String},
    church: {type: String},
    father_mobile_number :{type: Number},
    mother_mobile_number :{type: Number},
    father_confession_priest: {type: String},
    mother_confession_priest: {type: String},
    father_job: {type: String},
    mother_job: {type: String},
    sisters:[{
        name:{type: String},
        age:{type:Number}
    }],
    brothers:[{
        name:{type: String},
        age:{type:Number}
    }],
    group_id: [{type: mongoose.Schema.Types.ObjectId,ref: 'group'}],
    role_ids: [{type: mongoose.Schema.Types.ObjectId,ref: 'role'}],
    created_at: Date,
    updated_at: Date,
});


userSchema.pre('save', function (next) {
    var user = this;
	// only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});



userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};

userSchema.plugin(timestamps);

module.exports = mongoose.model('user', userSchema);