const express = require('express');

const Activity = require('./activity-model.js');

const router = express.Router();

// '/api/activity'

router.get('/', (req, res) => {
    Activity.findActivity()
    .then(features=>{
      const quakedata = []
      features.forEach(feature=>{
        Activity.findGeometry(feature.usgs_id)
        .then(geo=>{
          // 0 index to return object instead of array 
          //spread operator to insert geometry object into the array item.Activity
          feature = {...feature, geometry:geo[0]}
          console.log(feature)
        })

        quakedata.push(feature)
      }
    )

      //push for each quake, [{quake 1}, {quake 2}]
      //each of which has push for properties, geometry, id [{properties{}, geometry{}, id{}}, {properties{}, geometry{}, id{}}]
  

      // const quakedata={features}
      res.json(quakedata)
    })
    
    //features = array
      //items in the array, each of which is an object
       //each item, 3 objects: properties, geometry, id.


    



      
      // res.json(JSON.parse(quakes[0].coordinates)))



    //To add features
    //1. key value pair, 'features' & 'dump of activity'
    //DONE
  

    //To add type
    //SKIP for now

    //To add properties    


    //To add geometry 
    //1. findActivity to get quakes
    //2. parse the coordinates value into three item array
    //3. foreach on the activity to inject the new value in the correct format...
    //4. correct format: 

    //To add ID


    // "features": [
    //   {
    //       "type": "Feature",
    //       "properties": {
    //           "mag": 1.8,
    //           "place": "26 km SW of Goldfield, Nevada",
    //           "time": 1594256769530,
    //           "updated": 1594256989818,
    //           "tz": null,
    //           "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nn00758362",
    //           "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00758362&format=geojson",
    //           "felt": null,
    //           "cdi": null,
    //           "mmi": null,
    //           "alert": null,
    //           "status": "automatic",
    //           "tsunami": 0,
    //           "sig": 50,
    //           "net": "nn",
    //           "code": "00758362",
    //           "ids": ",nn00758362,",
    //           "sources": ",nn,",
    //           "types": ",origin,phase-data,",
    //           "nst": 19,
    //           "dmin": 0.276,
    //           "rms": 0.18,
    //           "gap": 126.39,
    //           "magType": "ml",
    //           "type": "earthquake",
    //           "title": "M 1.8 - 26 km SW of Goldfield, Nevada"
    //       },
    //       "geometry": {
    //           "type": "Point",
    //           "coordinates": [
    //               -117.4285,
    //               37.5292,
    //               8.9
    //           ]
    //       },
    //       "id": "nn00758362"
    //   },


    // .then(quakes => {
    //   const newquakes = quakes.forEach(quake => ({
    //     newquakes: {
    //       ...newquakes,
    //       coordinates: quake.coordinates,
    //     },
    //   }))
    //   res.json(newquakes);
    // })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get quakes' });
    });
  });

  module.exports = router;
