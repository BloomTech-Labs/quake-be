const express = require('express');
const axios = require('axios');
const Activity = require('./activity-model.js');
const cron = require('node-cron');


// '/api/activity'
const router = express.Router();


// '/api/activity/first-load
router.get("/first-load", async (req, res) => {
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

//first-load cron job
cron.schedule('0 */5 * * * *', () => { //runs every 5 minutes
    axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=30')
    .then(async response=>{
      const countEx = await Activity.countRecords('activity')
      const countExisting = countEx[Object.keys(countEx)[0]]
      const countRes = response.data.features.length;

      if (countRes == countExisting) {
        console.log('first-load: same number of records in response as in db, nothing to change in DB') //therefore do nothing
      } else {
        console.log('first-load: different number of records in response as in db, writing new DB')
        //wipe existing table
        const num2 = await Activity.delAllRecords('geometry')
        console.log('geometry', num2)
        const num1 = await Activity.delAllRecords('activity')
        console.log('activity', num1)

        //add new response to table
        let newFeatures=response.data.features.map(feature=>{ 
          feature.properties.usgs_id=feature.id;
          feature.geometry.usgs_id=feature.id
          feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
          Activity.addActivity(feature.properties, 'activity')
          Activity.addGeometry(feature.geometry, 'geometry')
        }
      )}    
    })
    .catch(error=>{
      res.status(500).json({message: "Failed to add quakes :(" })
    });
});

// '/api/activity/alltime-biggest
router.get("/alltime-biggest", async (req, res) => {
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

//all time biggest cron job
cron.schedule('0 0 0 * * *', () => { //runs everyday at midnight server time.
  axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=30')
  .then(async response=>{
    const countEx = await Activity.countRecords('all_time')
    const countExisting = countEx[Object.keys(countEx)[0]]
    const countRes = response.data.features.length;

    if (countRes == countExisting) {
      console.log('alltime-biggest: same number of records in response as in db, nothing to change in DB') //therefore do nothing
    } else {
      console.log('alltime-biggest: different number of records in response as in db, writing new DB') //therefore write new db
      //wipe existing table
      const num2 = await Activity.delAllRecords('geometry_all_time')
      console.log('geometry', num2)
      const num1 = await Activity.delAllRecords('all_time')
      console.log('activity', num1)

      //add new response to table

      let newFeatures=response.data.features.map(feature=>{ 
        feature.properties.usgs_id=feature.id;
        feature.geometry.usgs_id=feature.id
        feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
        Activity.addActivity(feature.properties, 'all_time')
        Activity.addGeometry(feature.geometry, 'geometry_all_time')
      }
    )}    
  })
  .catch(error=>{
    res.status(500).json({message: "Failed to add quakes :(" })
  });
});

  module.exports = router;
