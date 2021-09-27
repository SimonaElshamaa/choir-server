var mongoose = require('mongoose');
var timestamps = require('goodeggs-mongoose-timestamps');
// var fs = require('fs');
var schema = mongoose.Schema;

var groupSchema = new schema({
    id: {type: String},
    name:{type:String}
});

groupSchema.plugin(timestamps);

module.exports = mongoose.model('group', groupSchema);