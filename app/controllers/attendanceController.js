var Attendence = require('../models/attendence');

module.exports = {

	add_attendance: function (req, res) {
        var new_attendance = {
            date:req.body.date,
            user_id:req.body.user_id,
            group_id:req.body.group_id,
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
        const group_id = req.body.group_id;
        const date = req.body.date;
        Attendence.find({group_id, date}).exec(function(err, attendances){
            if (err) {
                res.json({state:false, status: 400, message: 'this doctor doesn\'t create any clinics yet!'});
            } else {
                res.json({state:true, status: 200, data: attendances, message: 'all groups!'});
            }
        });
    }    
}