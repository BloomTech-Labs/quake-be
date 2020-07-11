const express = require('express');

const Activity = require('./activity-model.js');

const router = express.Router();

// '/api/activity'

router.get("/", async (req, res) => {
  let features = await Activity.findActivity()
    try {
    // .then(async (features) => {
    let quakedata = [];
     let ax =  features.map( async (feature) => {
        // --- For Each Feature
        let featureComplete = {...feature};
        let geo = await Activity.findGeometry(feature.usgs_id)
        // --- Find the corresponding geometry
        console.log("this is quakedata", quakedata);
         featureComplete = { ...feature, geometry: geo[0] };

         console.log(featureComplete,"FEATURE COMP")
         return featureComplete


        // return quakedata.push(featureComplete);
        // arr.push(featureComplete);

        // .then(async (geo) => {
            // 0 index to return object instead of array
            //spread operator to insert geometry object into the array item.Activity
            // --- Append the feature with the found geometry
        // });
        // --- insert the completed feature into the quakedata array
        // console.log(arr,"ARR")
        // return arr
        
      });
     let tst = await Promise.allSettled(ax)
      console.log("this is OUTSIDE", ax,tst);

       res.json({qd: tst});
    
  
  
  
  
  
  } catch (error) {

    //push for each quake, [{quake 1}, {quake 2}]
    //each of which has push for properties, geometry, id [{properties{}, geometry{}, id{}}, {properties{}, geometry{}, id{}}]
  // })
  // .catch((err) => {
    console.log(error.message)

    res.status(500).json({ message: "Failed to get quakes" });

    
  }
    // });
});

  module.exports = router;
