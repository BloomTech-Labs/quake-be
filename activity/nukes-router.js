const express = require('express');
const axios = require('axios');
const Activity = require('./activity-model.js');
const cron = require('node-cron');


// '/api/nukes'
const router = express.Router();

// '/api/nukes/boom
router.get("/boom", async (req, res) => {
    let quakeFeatures = await Activity.findActivity('nukes')
      try {
       let newQuakes =  quakeFeatures.map( async (feature) => {
          // --- For Each Feature (Earthquake)
          let featureComplete = {};
          // Finding and assigning new geometry to each earthquake.
          let geo = await Activity.findGeometry('geometry_nukes', feature.usgs_id)
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
  
  //all time biggest caused by nukes
cron.schedule('0 0 0 * * *', () => { //runs everyday at midnight server time.
    console.log('nukes running')
    //get latest from DB
    Activity.checksum('nukes').then(res => {
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
      const minmagnitude = 5
      const maxmagnitude = 15
      const maxradiuskm = 20000
      const latitude = 37.78197
      const longitude = -121.93992
      //top 100
    
      //Use params to get latest nukes from USGS
      axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=10&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}&maxmagnitude=${maxmagnitude}&maxradiuskm=${maxradiuskm}&latitude=${latitude}&longitude=${longitude}&eventtype=nuclear%20explosion&orderby=magnitude`)
      .then(async response=>{
        const resUnsortedValues = response.data.features.map(a => a.id)
        const resValues = resUnsortedValues.sort(); //sort asc - important to compare checksums!
        const resChecksum = JSON.stringify(resValues) //create the checksum for the latest items from USGS
        console.log(resChecksum)
      
        //check if changed
        const compared = dbChecksum.localeCompare(resChecksum) //compare the two checksum strings 0=same, 1 or -1 if different(shows sort order)
        console.log('checksum result:', compared)
  
        if (compared == 0){
          console.log('nukes: nothing to change in DB, checksum of DB **MATCHES** checksum of latest from USGS') //therefore do nothing
        } else {
          console.log('nukes: writing new DB, checksum of latest from USGS is **DIFFERENT** from checksum of DB') //therefore change it up!
           //wipe existing table
           const nukesGeoWipe = await Activity.delAllRecords('geometry_nukes') //wipe them in same order as migration rollback
           console.log('geometry_nukes table wiped', nukesGeoWipe)
           const nukesWipe = await Activity.delAllRecords('nukes')
           console.log('nukes wiped', nukesWipe)
  
           //add new response to table
           console.log('nukes: adding new activity to DB')
          let newFeatures=response.data.features.map(feature=>{ 
            feature.properties.usgs_id=feature.id;
            feature.geometry.usgs_id=feature.id
            feature.geometry.coordinates=JSON.stringify(feature.geometry.coordinates)
            Activity.addActivity(feature.properties, 'nukes')
            Activity.addGeometry(feature.geometry, 'geometry_nukes')
          })
        }
      })
      .catch(error=>{
        console.log(error)
      });
    })
  });

  module.exports = router;
