const express = require('express');

const Activity = require('./activity-model.js');

const router = express.Router();

// '/api/activity'

router.get('/', (req, res) => {
    Activity.findActivity()
    .then(quakes => {
      res.json(quakes);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get quakes' });
    });
  });

  module.exports = router;
