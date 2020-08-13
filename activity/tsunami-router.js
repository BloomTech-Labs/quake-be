const express = require('express');
const axios = require('axios');
const Activity = require('./activity-model.js');
const cron = require('node-cron');


// '/api/tsunami'
const router = express.Router();

// '/api/tsunami/splash
router.get("/splash", async (req, res) => {
    let quakeFeatures = await Activity.findActivity('tsunami')
      try {
       let newQuakes =  quakeFeatures.map( async (feature) => {
          // --- For Each Feature (Earthquake)
          let featureComplete = {};
          // Finding and assigning new geometry to each earthquake.
          let geo = await Activity.findGeometry('geometry_tsunami', feature.usgs_id)
          //Assigning feature complete the new quake properties... 
          featureComplete = { 
            properties:feature, 
            geometry: geo[0]        
          };
          //We need this line to parse the coordinates back into an array.
          featureComplete.geometry.coordinates = JSON.parse(geo[0].coordinates);
          return featureComplete
        });
      //Resolving promises and returning data.
      let upgraded = await Promise.allSettled(newQuakes)
      const features = upgraded.map(newFeature=>{
      newFeature.properties=newFeature.value.properties;
      newFeature.geometry=newFeature.value.geometry;
      delete newFeature.value;
      delete newFeature.status;
      return newFeature
    })
    res.status(200).json({features});
    } 
    
    catch (error) {
      console.log(error.message)
      res.status(500).json({ message: "Failed to get quakes" });
    }
  });
  
 

  module.exports = router;
