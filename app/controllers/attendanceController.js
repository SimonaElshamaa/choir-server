var Attendence = require('../models/attendence');

module.exports = {

	add_attendance: function (req, res) {
        const date = new Date(req.body.date);

        const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const tomorrow = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()+1);
        Attendence.findOne({
            userId:req.body.userId,
            groupId:req.body.groupId, date:{
                $gte: new Date(today), 
                $lt: new Date(tomorrow)
        }}).exec(function(err, attendance){
            const updated_attendance={
                attend:req.body.attend,
                note: req.body.note,
            };
            if(attendance){
                Attendence.findOneAndUpdate({
                    userId:req.body.userId,
                    groupId:req.body.groupId, date:{
                        $gte: new Date(today), 
                        $lt: new Date(tomorrow)
                }},{$set: updated_attendance },{new: true},function(err,attendance){
                    if (err) {
                        var message = err
                        res.json({status: 422, title: message, type:"Error",details:message});
                        return;
                    }
                    res.json({
                        state:true,
                        status: 204,
                        data: attendance, 
                        message: 'attendance is updated successfully'
                    });     
                })
            }else{
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
            }
        });    		
    },
    get_group_attendance_by_date: function(req, res){
        const groupId = req.params.groupId;
        const today = req.params.today;
        const tomorrow = req.params.tomorrow;
        Attendence.find({groupId:groupId, date:{
                $gte: new Date(today), 
                $lt: new Date(tomorrow)
        }}).exec(function(err, attendances){
            if (err) {
                res.json({status: 422, title: 'no groups created yet!', type:'Server Error', details:err});
            } else {
                res.json({state:true, status: 204, data: attendances, message: 'all groups!'});
            }
        });
    }    
}