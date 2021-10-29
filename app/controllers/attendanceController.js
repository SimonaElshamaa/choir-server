var Attendence = require('../models/attendence');

module.exports = {

	add_attendance: function (req, res) {
        var new_attendance = {
            date:new Date(req.body.date),
            userId:req.body.userId,
            groupId:req.body.groupId,
            attend:req.body.attend,
            note: req.body.note
        };
        var newAttendanceRecord = new Attendence(new_attendance);
        newAttendanceRecord.save(function (err) {
            if (err) {
                var message = err
                res.json({status: 422, title: message, type:"Error",details:message});
                return;
            }

                res.json({
                    state:true,
                    status: 204,
                    data: newAttendanceRecord, 
                    message: 'attendance is created successfully'
                });
            
        });  		
    },
    
    get_group_attendance_by_date: function(req, res){
        const groupId = req.params.groupId;
        const date = req.params.date;
        Attendence.find({groupId, date}).exec(function(err, attendances){
            if (err) {
                res.json({status: 422, title: 'no groups created yet!', type:'Server Error', details:err});
            } else {
                res.json({state:true, status: 204, data: attendances, message: 'all groups!'});
            }
        });
    }    
}