const express = require("express");
const axios = require("axios");
// const Sms = require('./sms-model.js'); //Add this model for SMS table db actions.
const cron = require("node-cron");
require("dotenv").config();
const turf = require("turf");
const {
  ConversationPage,
} = require("twilio/lib/rest/conversations/v1/conversation");

// '/api/sms'
const router = express.Router();

router.post("/create-notify", async (req, res) => {
  const user = req.body;
  console.log(user);

  createUser(user);
  res.status(200).json({
    message: "created",
  });
});

function createUser(user) {
  const accountSid = process.env.ACC_SID;
  const authToken = process.env.TW_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.chat
    .services(process.env.SERVICE_SID)
    .users.create({
      identity: user.cell,
      uniqueName: user.cell,
      attributes: JSON.stringify(user),
    })
    .then((N = (newUser) => console.log(newUser)));
  //Eddie - add verification code here - check user owns the number//
}

// Add Cron job here to check latest activity against potential notification
// frequency every 5 min
// 24 hrs of activity (USGS could retrospectively add activity, not always real-time)
// Min Magnitude = 5 or user preference
// Global radius
// check if there has been new activity since the last refresh (5 mins)
cron.schedule("0 */1 * * * *", () => {
  //runs every 5 minutes. Lowered to 1 min for testing.
  //Get the params for query ready
  //Dates
  var today = new Date();
  const ymd = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  var days = 1; // Days you want to subtract
  var date = new Date();
  var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  var day = last.getDate();
  var month = last.getMonth() + 1;
  var year = last.getFullYear();
  const oneDay = `${year}-${month}-${day}`;

  console.log("current date:", ymd);
  console.log("24hrs:", oneDay);
  const starttime = oneDay;
  console.log("starttime", starttime);
  const endtime = ymd;
  console.log("endtime", endtime);

  //Other params
  const minmagnitude = 4; //lowered it for testing
  const maxmagnitude = 11;
  const maxradiuskm = 7000; //global;
  const latitude = 37.78197; //just needs some long/lat to pull.
  const longitude = -121.93992;
  //no limit on results.

  //Use params to get latest from USGS
  axios
    .get(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}&maxmagnitude=${maxmagnitude}&maxradiuskm=${maxradiuskm}&latitude=${latitude}&longitude=${longitude}&orderby=magnitude`
    )
    .then(async (response) => {
      const resUnsortedValues = response.data.features.map((a) => {
        return {
          id: a.id,
          time: a.properties.time,
          mag: a.properties.mag,
          geo: a.geometry.coordinates,
        };
        //add id, time, mag, geometery.coordinates,
      });
      const resValues = resUnsortedValues.sort(); //sort asc - important to compare checksums!
      console.log(resValues); //resValues now contains an array of activity matching the criteria.  Next step is to fetch from Twilio then we can compare to understand which match attributes.

      //Eddie- Fetch list of channels from Twilio
      // insert fetch channels and attributes here (within the .then)
      //
      //
      router.get("/fetchVerifiedUser", async (req, res) => {
        // const userSid = "CHba34fbcc81d544eb9cd98a7d4040bb58";
        fetchMemberResource();
        res.status(200).json({ message: "member fetched" });
      });

      function fetchMemberResource() {
        const accountSid = process.env.ACC_SID;
        const authToken = process.env.TW_TOKEN;
        const serviceSid = process.env.SERVICE_SID;
        const client = require("twilio")(accountSid, authToken);

        client.chat
          .services(serviceSid)
          .users.list({ limit: 500 })
          .then((users) => users.forEach((u) => console.log(u.sid)));
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//Pete- Compare any new activity with criteria in the Twilio attributes
//Here is where we will confirm the USGS Activity ID has not already been notified to a particular cell # to avoid duplicates.
// insert comparison and check here
//

//Eddie- If new match, trigger an SMS notification...
// insert Twilio SMS trigger here, we will also add the activity ID and current time/date as an attribute to channel so that can confirm who has already received which notifications, when.
//

// distanceBetween will be used in comparison for distance check.
// [long, lat], [long, lat] ***caution that longitude is first param and latitude is second param***
// example: distanceBetween([-75.343, 39.984], [-75.534, 39.123]) should provide distance of 97.16km
function distanceBetween(from, to) {
  const fromCoords = turf.point(from);
  const toCoords = turf.point(to);
  console.log(fromCoords, toCoords);

  const distance = turf.distance(fromCoords, toCoords).toFixed(3); // result is in km
  return distance;
}

module.exports = router;
