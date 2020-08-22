const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const turf = require("turf");
const moment = require("moment");
require("dotenv").config();

//Twilio variables
const accountSid = process.env.ACC_SID;
const authToken = process.env.TW_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
const {
  ConversationPage,
} = require("twilio/lib/rest/conversations/v1/conversation");

// '/api/sms' <-- this is path to any endpoints in this router.
const router = express.Router();


async function getUsgs() {
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

  const starttime = oneDay;
  const endtime = ymd;

  //Other params
  const minmagnitude = 4;
  const maxmagnitude = 11;
  const maxradiuskm = 6371; //global
  const latitude = 37.2751; //just needs some long/lat to pull global
  const longitude = -121.8261;

  //Use params to get latest from USGS, ensure no limit on the request.
  try {
    const res = await axios.get(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}&maxmagnitude=${maxmagnitude}&maxradiuskm=${maxradiuskm}&latitude=${latitude}&longitude=${longitude}&orderby=magnitude`
    );
    if (res.status == 200) {
    // console.log('log within res 200', res.status);
    }
    const resUnsortedValues = res.data.features.map((a) => {
      return {
        id: a.id,
        time: a.properties.time,
        mag: a.properties.mag,
        geo: a.geometry.coordinates,
        place: a.properties.place,
      };
    });
    const result = await resUnsortedValues.sort(); //sort asc
    return result;
    } 
    catch (err) {
      console.error(err);
    }
}

async function getTwilioUsers() {
  try {
    const res = await client.chat
    .services(serviceSid)
    .users.list({
      limit: 500
    });
  const resUsers = res.map((users) => {
    return {
      identity: users.identity,
      attributes: users.attributes,
    };
  });
  const result = await resUsers;
  return result;
  }
  catch (err) {
    console.error(err);
  }
}


// Cron job here to check latest activity against potential notification.
// frequency every 5 min, 24 hrs of activity (USGS could retrospectively add activity, not always real-time)
// Min Magnitude = 5 but could add user preference later with consideration of sms volume, Global radius.
cron.schedule("0 */1 * * * *", () => {
  
  getUsgs().then((resValues) => {
    console.log(`**** there are currently ${resValues.length} earthquakes in the last 24hrs which could match a notification ****`);
    console.log(resValues);
  });

  getTwilioUsers().then((resUsers) => {
    console.log(`**** there are currently ${resUsers.length} notifications which could match a activity, checking now ****`);
    console.log(resUsers);
  });



  //         console.log("current users", resUsers);

  //         //map over each notification request from users
  //         // console.log('start of user map');
  //         const smsToSend = []; //starts with an empty array which will capture any sms to send.
  //         const fetchCompareResult = resUsers.map((user) => {
  //           const parsedUser = JSON.parse(user.attributes);
  //           //check the Twilio entry has attributes and in correct format
  //           if (
  //             user.attributes.length > 0 &&
  //             typeof parsedUser.coordinates == "object"
  //           ) {
  //             //map over each activity to check if it matches this user request
  //             const matchingActivity = resValues.map((activity) => {
  //               const calcDistance = distanceBetween(
  //                 parsedUser.coordinates,
  //                 activity.geo
  //               );
  //               // console.log('distance of activity check', calcDistance);
  //               const matchResult = fetchCompare(
  //                 calcDistance,
  //                 parsedUser.distance,
  //                 4.99,
  //                 activity.mag
  //               ); //setting minimum mag to 5, maybe give user option in future.
  //               // console.log('matchResult', matchResult, parsedUser, activity);

  //               if (matchResult == true) {
  //                 //check that user hasn't already received notification for this id here:
  //                 if (parsedUser.sentReceipts) {
  //                   // console.log('receipts', parsedUser.sentReceipts);
  //                   parsedUser.sentReceipts.forEach((id) => {
  //                     if (activity.id == id) {
  //                       // console.log('already sent, will not be added to smsToSent')
  //                     }
  //                   });
  //                 } else {
  //                   //Store the details needed to send sms
  //                   const notifyTrue = {
  //                     cell: parsedUser.cell,
  //                     distance: Math.round(calcDistance),
  //                     mag: activity.mag,
  //                     time: moment(activity.time).format(
  //                       "MM-DD-YYYY / hh:mm A"
  //                     ),
  //                     id: activity.id,
  //                     attributes: parsedUser,
  //                     place: activity.place,
  //                   };
  //                   smsToSend.push(notifyTrue);
  //                 }
  //               }
  //             });
  //           }
  //         });

  //         // console.log('Fetch comparison complete');
  //         if (smsToSend.length > 0) {
  //           console.log(`**** ${smsToSend.length} notification(s) to be sent:`);
  //           // console.log(smsToSend);
  //           // Trigger SMS to be sent here by mapping over smsToSend
  //           // Ensure we add activity id to Twilio user attribute at this point to avoid duplicate notifications
  //           setTimeout(() => {
  //             smsToSend.forEach((item) => {
  //               setTimeout(() => {
  //                 const currentAttributes = item.attributes;
  //                 if (item.attributes.sentReceipts) {
  //                   // console.log('has received sms in the past', item.attributes.sentReceipts)
  //                   const updatedReceipts = item.attributes.sentReceipts;
  //                   updatedReceipts.push(item.id);
  //                   const updatedAttributesMore = {
  //                     ...item.attributes,
  //                     sentReceipts: updatedReceipts,
  //                   };
  //                   // console.log(updatedAttributesMore)
  //                   sendSms(item).then(async (response) => {
  //                     console.log("30s delay to help Twilio servers");
  //                     setTimeout(() => {
  //                       console.log("send response", response);
  //                       client.chat
  //                         .services(serviceSid)
  //                         .users(item.cell)
  //                         .update({
  //                           attributes: JSON.stringify(updatedAttributesMore),
  //                         })
  //                         .then((user) => console.log(user))
  //                         .catch((error) => {
  //                           console.log(error);
  //                         });
  //                     }, 30000);
  //                   });
  //                 } else {
  //                   const updatedAttributes = {
  //                     ...item.attributes,
  //                     sentReceipts: [item.id],
  //                   };
  //                   // console.log(updatedAttributes);
  //                   sendSms(item).then(async (response) => {
  //                     console.log("30s delay to help Twilio servers");
  //                     setTimeout(() => {
  //                       console.log("send response", response);
  //                       client.chat
  //                         .services(serviceSid)
  //                         .users(item.cell)
  //                         .update({
  //                           attributes: JSON.stringify(updatedAttributes),
  //                         })
  //                         .then((user) => console.log(user))
  //                         .catch((error) => {
  //                           console.log(error);
  //                         });
  //                     }, 30000);
  //                   });
  //                 }
  //               }, 30000); //5 second timer delay between sms send to help Twilio servers
  //             });
  //           }, 30000); //wait 5s after initial Twilio fetch
  //         } else {
  //           console.log("**** no notifications to send ****");
  //         }
  //       });
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
});



async function firstAsync() {
  return 42;
}


router.post("/create-notify", async (req, res) => {
  const user = req.body;
  console.log(user);

  createUser(user);
  res.status(200).json({
    message: "created",
  });
});

function createUser(user) {
  client.chat
    .services(process.env.SERVICE_SID)
    .users.create({
      identity: user.cell,
      uniqueName: user.cell,
      attributes: JSON.stringify(user),
    })
    .then((N = (newUser) => console.log(newUser)));
}

router.post("/verify", async (req, res) => {
  const user = "+17605297438";
  console.log(user);

  verifyUser(user);
  res.status(200).json({
    message: "created",
  });
});

async function sendSms(activityData) {
  return new Promise((res) => {
    client.messages
      .create({
        body: `This is a notification from Faultline.app, an earthquake measuring ${activityData.mag} has been detected ${activityData.distance}km from the location you provided. According to USGS, the time of the earthquake was ${activityData.time} and the location was ${activityData.place}`,
        from: process.env.TWILIO_NUMBER,
        to: activityData.cell,
      })
      .done();
  });
}



// distanceBetween will be used in comparison for distance check.
// [long, lat], [long, lat] ***caution that longitude is first param and latitude is second param***
// example: distanceBetween([-75.343, 39.984], [-75.534, 39.123]) should provide distance of 97.16km
function distanceBetween(from, to) {
  const fromCoords = turf.point(from);
  const toCoords = turf.point(to);
  const distance = turf.distance(fromCoords, toCoords).toFixed(3); // result is in km
  return distance;
}

// Returns true or false if match. Must pass in all params
// seperated this out as a function to keep the main function shorter and intuitive
function fetchCompare(calcDistance, userDistance, userMag, activityMag) {
  if (calcDistance <= userDistance && activityMag >= userMag) {
    return true;
  } else {
    return false;
  }
}





module.exports = router;
