const express = require('express');
const axios = require('axios');

const Activity = require('./activity-model.js');
const cron = require('node-cron');



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

cron.schedule('*/10 * * * * *', () => {
    axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=3')
    .then(async response=>{
      const countEx = await Activity.countRecords()
      const countExisting = countEx[Object.keys(countEx)[0]]
      const countRes = response.data.features.length;

      if (countRes == countExisting) {
        console.log('same number of records in response as in db') //therefore do nothing
      } else {
        console.log('different number of records in response as in db')
        //wipe existing table
        const num1 = await Activity.delAllRecords('activity')
        console.log('activity', num1)
        const num2 = await Activity.delAllRecords('geometry')
        console.log('geometry', num2)
        //add new response to table

        let newFeatures=response.data.features.map(feature=>{ 
          feature.properties.usgs_id=feature.id;
          feature.geometry.usgs_id=feature.id
          feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
          Activity.addActivity(feature.properties)
          Activity.addGeometry(feature.geometry)
        }
      )}    
    })
    .catch(error=>{
      res.status(500).json({message: "Failed to add quakes :(" })
    });
});


  module.exports = router;
