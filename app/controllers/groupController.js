const Group = require('../models/group');

module.exports = {

  add_group: async (req, res) => {
    try {
      const count = await Group.countDocuments({}).exec();
      const counter = count + 1;

      const newGroup = new Group({
        Identifier: counter,
        name: req.body.name
      });

      await newGroup.save();

      res.json({ state: true, message: 'Group Added', data: newGroup });

    } catch (err) {
      res.status(422).json({ title: 'Server Error', type: 'Server Error', message: err.message || err });
    }
  },

  get_groups: async (req, res) => {
    try {
      const groups = await Group.find().exec();
      res.json({ state: true, data: groups, message: 'All groups!' });
    } catch (err) {
      res.status(422).json({ title: 'Server Error', type: 'Server Error', message: err.message || err });
    }
  }

};
