const Attendance = require('../models/attendence');

module.exports = {

  add_attendance: async (req, res) => {
    try {
      const date = new Date(req.body.date);
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const attendance = await Attendance.findOne({
        userId: req.body.userId,
        groupId: req.body.groupId,
        date: { $gte: today, $lt: tomorrow }
      }).exec();

      const updatedAttendance = {
        attend: req.body.attend,
        note: req.body.note
      };

      if (attendance) {
        const updated = await Attendance.findOneAndUpdate(
          { userId: req.body.userId, groupId: req.body.groupId, date: { $gte: today, $lt: tomorrow } },
          { $set: updatedAttendance },
          { new: true }
        ).exec();

        return res.json({
          state: true,
          data: updated,
          message: 'Attendance is updated successfully'
        });
      } else {
        const newAttendance = new Attendance({
          date: new Date(req.body.date),
          userId: req.body.userId,
          groupId: req.body.groupId,
          attend: req.body.attend,
          note: req.body.note
        });

        await newAttendance.save();

        return res.json({
          state: true,
          data: newAttendance,
          message: 'Attendance is created successfully'
        });
      }

    } catch (err) {
      res.status(422).json({ title: 'Error', type: "Error", details: err.message || err });
    }
  },

  get_group_attendance_by_date: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const today = new Date(req.params.today);
      const tomorrow = new Date(req.params.tomorrow);

      const attendances = await Attendance.find({
        groupId,
        date: { $gte: today, $lt: tomorrow }
      }).exec();

      res.json({ state: true, data: attendances, message: 'All attendances!' });

    } catch (err) {
      res.status(422).json({ title: 'Error', type: 'Server Error', details: err.message || err });
    }
  }

};
