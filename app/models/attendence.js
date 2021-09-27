var mongoose = require('mongoose');
var timestamps = require('goodeggs-mongoose-timestamps');
// var fs = require('fs');
var schema = mongoose.Schema;

var attendenceSchema = new schema({
    id: {type: String},
    date:Date,
    user_id:{ type: schema.Types.ObjectId, ref: 'member' },
    group_id:{ type: schema.Types.ObjectId, ref: 'group' },
    attend:{type: Boolean},
    note :{type:String},
    created_at: Date,
    updated_at: Date
});


attendenceSchema.plugin(timestamps);

module.exports = mongoose.model('attendence', attendenceSchema);