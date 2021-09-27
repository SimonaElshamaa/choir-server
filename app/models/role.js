var mongoose = require('mongoose');
var timestamps = require('goodeggs-mongoose-timestamps');
// var fs = require('fs');
var schema = mongoose.Schema;

var roleSchema = new schema({
    id: {type: String},
    name:{type:String}
});


roleSchema.plugin(timestamps);

module.exports = mongoose.model('role', roleSchema);