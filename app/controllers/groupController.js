var Group = require('../models/group');

module.exports = {

	add_group: function (req, res) {
        Group.countDocuments({}, function(err, count) {
            if (err) {
                var message = err
                res.json({state:false, status: 400, message: message});
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
                    res.json({state:false, status: 400, message: message});
                    return;
                }
                res.json({state:true, status: 204, message: 'Group Added', data:newGroup});
            });		
        });
    },
    
    get_groups: function(req, res){
        Group.find().exec(function(err, groups){
            if (err) {
                res.json({state:false, status: 400, message: 'no groups created yet!'});
            } else {
                res.json({state:true, status: 204, data: groups, message: 'all groups!'});
            }
        });
    }    
}