const express = require('express');

const Activity = require('./activity-model.js');

const router = express.Router();

// '/api/activity'

router.get("/", async (req, res) => {
  let features = await Activity.findActivity()
    try {
     let newQuakes =  features.map( async (feature) => {
        // --- For Each Feature (Earthquake)
        let featureComplete = {...feature};
        // Finding and assigning new geometry to each earthquake.
        let geo = await Activity.findGeometry(feature.usgs_id)
        //Assigning feature complete the new quake properties... 
        featureComplete = { 
          ...feature, 
          geometry: geo[0]        
        };
        // We need this line to parse the coordinates back into an array.
        featureComplete.geometry.coordinates = JSON.parse(geo[0].coordinates);
        return featureComplete
      });
    //Resolving promises and returning data.
    let quakeData = await Promise.allSettled(newQuakes)
    res.json({quakeData});
  } 
  
  catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Failed to get quakes" });
  }
});

  module.exports = router;
