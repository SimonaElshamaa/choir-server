var Group = require('../models/group');

module.exports = {

	add_group: function (req, res) {
        var new_group = {
            name:req.body.name
        };
        var newGroup = new Group(new_group);
        newGroup.save(function (err) {
            if (err) {
                var message = err
                res.json({state:false, status: 400, message: message});
                return;
            }

                res.json({
                    state:true,
                    status: 200,
                    data: newGroup, 
                    message: 'group is created successfully'
                });
            
        });  		
    },
    
    get_groups: function(req, res){
        Group.find().exec(function(err, groups){
            if (err) {
                res.json({state:false, status: 400, message: 'no groups created yet!'});
            } else {
                res.json({state:true, status: 200, data: groups, message: 'all groups!'});
            }
        });
    }    
}