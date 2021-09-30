var Attendence = require('../models/attendence');

module.exports = {

	add_attendance: function (req, res) {
        var new_attendance = {
            date:req.body.date,
            userId:req.body.userId,
            groupId:req.body.groupId,
            attend:req.body.attend,
            note: req.body.note
        };
        var newAttendanceRecord = new Attendence(new_attendance);
        newAttendanceRecord.save(function (err) {
            if (err) {
                var message = err
                res.json({state:false, status: 400, message: message});
                return;
            }

                res.json({
                    state:true,
                    status: 200,
                    data: newAttendanceRecord, 
                    message: 'attendance is created successfully'
                });
            
        });  		
    },
    
    get_group_attendance_by_date: function(req, res){
        const groupId = req.body.groupId;
        const date = req.body.date;
        Attendence.find({groupId, date}).exec(function(err, attendances){
            if (err) {
                res.json({state:false, status: 400, message: 'no groups created yet!'});
            } else {
                res.json({state:true, status: 204, data: attendances, message: 'all groups!'});
            }
        });
    }    
}