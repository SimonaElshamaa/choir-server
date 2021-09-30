var mongoose = require('mongoose');
var timestamps = require('goodeggs-mongoose-timestamps');
// var fs = require('fs');
var schema = mongoose.Schema;

var attendenceSchema = new schema({
    id: {type: String},
    date:Date,
    userId:{ type: schema.Types.ObjectId, ref: 'user' },
    groupId:{ type: Number },
    attend:{type: Boolean},
    note :{type:String},
    created_at: Date,
    updated_at: Date
});


attendenceSchema.plugin(timestamps);

module.exports = mongoose.model('attendence', attendenceSchema);