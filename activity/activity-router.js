const express = require('express');
const axios = require('axios');
const Activity = require('./activity-model.js');
const cron = require('node-cron');

// '/api/activity'
const router = express.Router();

// '/api/activity/first-load
router.get("/first-load", async (req, res) => {
  let quakeFeatures = await Activity.findActivity('activity')
    try {
     let newQuakes =  quakeFeatures.map( async (feature) => {
        // --- For Each Feature (Earthquake)
        let featureComplete = {};
        // Finding and assigning new geometry to each earthquake.
        let geo = await Activity.findGeometry('geometry', feature.usgs_id)
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

//first-load cron job
cron.schedule('0 */5 * * * *', () => { //runs every 5 minutes
  
  //get latest from DB
  Activity.checksum('activity').then(res => {
    const arrayValues = res.map(a=> a.usgs_id)
    const dbChecksum = JSON.stringify(arrayValues) //create the checksum for DB items
    // console.log(dbChecksum)

    //Get the params for query ready
    //Dates
    var today = new Date();
    const ymd = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

    var days = 7; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    var day =last.getDate();
    var month=last.getMonth()+1;
    var year=last.getFullYear();
    const sevenDays = `${year}-${month}-${day}`;
    
    // console.log('current date:', ymd);
    // console.log('7 days ago:', sevenDays);
    const starttime = sevenDays;
    console.log('starttime', starttime);
    const endtime = ymd;
    console.log('endtime', endtime);


    //Other params
    const minmagnitude = 0
    const maxmagnitude = 11
    const maxradiuskm = 7000 //global
    const latitude = 37.78197
    const longitude = -121.93992
  
    //Use params to get latest from USGS
    axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=30&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}&maxmagnitude=${maxmagnitude}&maxradiuskm=${maxradiuskm}&latitude=${latitude}&longitude=${longitude}&orderby=magnitude`)
    .then(async response=>{
      const resUnsortedValues = response.data.features.map(a => a.id)
      const resValues = resUnsortedValues.sort(); //sort asc - important to compare checksums!
      const resChecksum = JSON.stringify(resValues) //create the checksum for the latest items from USGS
      // console.log(resChecksum)
    
      //check if changed
      const compared = dbChecksum.localeCompare(resChecksum) //compare the two checksum strings 0=same, 1 or -1 if different(shows sort order)
      console.log('checksum result:', compared)

      if (compared == 0){
        console.log('first-load: nothing to change in DB, checksum of DB **MATCHES** checksum of latest from USGS') //therefore do nothing
      } else {
        console.log('first-load: writing new DB, checksum of latest from USGS is **DIFFERENT** from checksum of DB') //therefore change it up!
         //wipe existing table
         const geoWipe = await Activity.delAllRecords('geometry') //wipe them in same order as migration rollback
         console.log('geometry', geoWipe)
         const activityWipe = await Activity.delAllRecords('activity')
         console.log('activity', activityWipe)

         //add new response to table
         console.log('first-load: adding new activity to DB')
        let newFeatures=response.data.features.map(feature=>{ 
          feature.properties.usgs_id=feature.id;
          feature.geometry.usgs_id=feature.id
          feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
          Activity.addActivity(feature.properties, 'activity')
          Activity.addGeometry(feature.geometry, 'geometry')
        })
      }
    })
    .catch(error=>{
      console.log(error)
    });
  })
  .catch(error => {
      console.log(error)
  })
});



// '/api/activity/alltime-biggest
router.get("/alltime-biggest", async (req, res) => {
  let quakeFeatures = await Activity.findActivity('all_time')
    try {
     let newQuakes =  quakeFeatures.map( async (feature) => {
        // --- For Each Feature (Earthquake)
        let featureComplete = {};
        // Finding and assigning new geometry to each earthquake.
        let geo = await Activity.findGeometry('geometry_all_time', feature.usgs_id)
        //Assigning feature complete the new quake properties... 
        featureComplete = { 
          properties:feature, 
          geometry: geo[0]        
        };
        // We need this line to parse the coordinates back into an array.
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

//all time biggest cron job
cron.schedule('0 0 0 * * *', () => { //runs everyday at midnight server time.
  console.log('all time running')
  //get latest from DB
  Activity.checksum('all_time').then(res => {
    const arrayValues = res.map(a=> a.usgs_id)
    const dbChecksum = JSON.stringify(arrayValues) //create the checksum for DB items
    // console.log(dbChecksum)

    //Get the params for query ready
    //Dates
    var today = new Date();
    const ymd = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    // console.log('current date:', ymd);
    // console.log('7 days ago:', sevenDays);
    const starttime = '1880-01-01';
    const endtime = ymd;

    //Other params
    const minmagnitude = 7
    const maxmagnitude = 15
    const maxradiuskm = 20000
    const latitude = 37.78197
    const longitude = -121.93992
    //top 100
  
    //Use params to get latest from USGS
    axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}&maxmagnitude=${maxmagnitude}&maxradiuskm=${maxradiuskm}&latitude=${latitude}&longitude=${longitude}&orderby=magnitude`)
    .then(async response=>{
      const resUnsortedValues = response.data.features.map(a => a.id)
      const resValues = resUnsortedValues.sort(); //sort asc - important to compare checksums!
      const resChecksum = JSON.stringify(resValues) //create the checksum for the latest items from USGS
      console.log(resChecksum)
    
      //check if changed
      const compared = dbChecksum.localeCompare(resChecksum) //compare the two checksum strings 0=same, 1 or -1 if different(shows sort order)
      console.log('checksum result:', compared)

      if (compared == 0){
        console.log('alltime-biggest: nothing to change in DB, checksum of DB **MATCHES** checksum of latest from USGS') //therefore do nothing
      } else {
        console.log('alltime-biggest: writing new DB, checksum of latest from USGS is **DIFFERENT** from checksum of DB') //therefore change it up!
         //wipe existing table
         const geo_all_timeWipe = await Activity.delAllRecords('geometry_all_time') //wipe them in same order as migration rollback
         console.log('geometry_all_time table wiped', geo_all_timeWipe)
         const all_timeWipe = await Activity.delAllRecords('all_time')
         console.log('all_time table wiped', all_timeWipe)

         //add new response to table
         console.log('all_time: adding new activity to DB')
        let newFeatures=response.data.features.map(feature=>{ 
          feature.properties.usgs_id=feature.id;
          feature.geometry.usgs_id=feature.id
          feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
          Activity.addActivity(feature.properties, 'all_time')
          Activity.addGeometry(feature.geometry, 'geometry_all_time')
        })
      }
    })
    .catch(error=>{
      console.log(error)
    });
  })
});

  module.exports = router;
