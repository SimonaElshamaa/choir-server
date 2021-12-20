var Group = require('../models/group');

module.exports = {

	add_group: function (req, res) {
        Group.countDocuments({}, function(err, count) {
            if (err) {
                var message = err
                res.status(400).json({state:false, message: message});
                return;
            }
            var counter = ++count;
            var groupAttributes;
            
            groupAttributes = {
                Identifier :counter,
                name: req.body.name
            };
            
            var newGroup = new Group(groupAttributes);

            newGroup.save(function (err) {
                if (err) {
                    var message = err
                    res.status(422).json({title:'Server Error', type:'Server Error', message: message});
                    return;
                }
                res.json({state:true, message: 'Group Added', data:newGroup});
            });		
        });
    },
    
    get_groups: function(req, res){
        Group.find().exec(function(err, groups){
            if (err) {
                res.status(422).json({title:'Server Error', type:'Server Error', message: err});
            } else {
                res.json({state:true, data: groups, message: 'all groups!'});
            }
        });
    }    
}