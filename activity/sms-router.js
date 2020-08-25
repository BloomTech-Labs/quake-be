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
  // Min Magnitude = 5 but could add user preference later with consideration of sms volume, Global radius.
  const minmagnitude = 4.9;
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
  } catch (err) {
    console.error(err);
  }
}

async function getTwilioUsers() {
  try {
    const res = await client.chat.services(serviceSid).users.list({
      limit: 500,
    });
    const resUsers = res.map((users) => {
      return {
        identity: users.identity,
        attributes: users.attributes,
      };
    });
    const result = resUsers;
    return result;
  } catch (err) {
    console.error(err);
  }
}

function checkMatches(resValues, resUsers) {
  const smsToSend = []; //starts with an empty array we will use to capture any sms to send
  console.log("start of checkMatches");

  const constructPush = (parsedUser, calcDistance, activity) => {
    console.log("constructing object to be sent");
    const notifyTrue = {
      cell: parsedUser.cell,
      distance: Math.round(calcDistance),
      mag: activity.mag,
      time: moment(activity.time).format("MM-DD-YYYY / hh:mm A"),
      id: activity.id,
      attributes: parsedUser,
      place: activity.place,
    };
    smsToSend.push(notifyTrue);
  };

  // map over each notification request from users
  const fetchCompareResult = resUsers.map((user) => {
    const parsedUser = JSON.parse(user.attributes);
    //  check the Twilio entry has attributes and in correct format
    if (
      user.attributes.length > 0 &&
      typeof parsedUser.coordinates == "object"
    ) {
      //map over each activity to check if it matches this user request
      const matchingActivity = resValues.map((activity) => {
        const calcDistance = distanceBetween(
          parsedUser.coordinates,
          activity.geo
        );
        // console.log('distance of activity check', calcDistance);
        const matchResult = fetchCompare(calcDistance, parsedUser.distance, 4.9, activity.mag); //actual distance, the minimum distance selected by user, user mag and actual mag.
        // console.log(matchResult);

        if (matchResult == true) {
          //check that user hasn't already received notification for this id here:
          if (parsedUser.sentReceipts) {
            //has some receipts of previous activity
            // console.log('total receipts to check', parsedUser.sentReceipts.length)
            var found = false;
            parsedUser.sentReceipts.forEach((id) => {
              // console.log('checking receipt', activity.id, id)
              if (activity.id == id) {
                // console.log('already sent, will not be added to smsToSent')
                found = true;
              }
            });
            if (found == true) {
              // console.log('found in receipts, will not send');
            } else {
              console.log("user has no receipts, adding now");
              //Construct the object with details needed to send sms
              constructPush(parsedUser, calcDistance, activity);
            }
          } else {
            console.log("user has no receipts, adding now");
            //Construct the object with details needed to send sms
            constructPush(parsedUser, calcDistance, activity);
          }
        }
      });
    }
  });
  console.log(`checkMatches complete, ${smsToSend.length} to send`);
  return smsToSend;
}

// distanceBetween is used in comparison for distance check.
// [long, lat], [long, lat] ***caution that longitude is first param and latitude is second param***
// example: distanceBetween([-75.343, 39.984], [-75.534, 39.123]) should provide distance of 97.16km
function distanceBetween(from, to) {
  const fromCoords = turf.point(from);
  const toCoords = turf.point(to);
  const distance = turf.distance(fromCoords, toCoords).toFixed(3); // result is in km
  return distance;
}

// Returns true or false if match. Must pass in all the params
// seperated this out as a function to keep the main function shorter and intuitive
function fetchCompare(calcDistance, userDistance, userMag, activityMag) {
  if (calcDistance <= userDistance && activityMag >= userMag) {
    return true;
  } else {
    return false;
  }
}

async function sendSms(item) {
  const twilio = require('twilio')(
    process.env.ACC_SID,
    process.env.TW_TOKEN
  );
  const body = `This is a notification from Faultline.app, an earthquake measuring ${item.mag} has been detected ${item.distance}km from the location you provided. According to USGS, the time of the earthquake was ${item.time} and the location was ${item.place}. Reply with STOP at any time to stop notifications`
  const number = item.cell;
  twilio.messages
    .create({
      to: number,
      from: process.env.TWILIO_NUMBER,
      body: body,
    })
    .then((messages) => {
      const numEnding = item.cell.slice(-4); //trim to last 4 digits

      console.log(`Notification sent to cell num ending ${numEnding}`);
      //then add receipt to avoid duplicates
      attributesReceipt(item);
    })
    .catch((err) => console.error(err));
}

function attributesReceipt(item) {
  if (item.attributes.sentReceipts) {
    // this is if user has previously had a notification, we'll push the receipt onto the array
    const updatedReceipts = item.attributes.sentReceipts;
    updatedReceipts.push(item.id);
    const updatedAttributesMore = {
      ...item.attributes,
      sentReceipts: updatedReceipts,
    };
    // console.log(updatedAttributesMore)
    client.chat
      .services(serviceSid)
      .users(item.cell)
      .update({
        attributes: JSON.stringify(updatedAttributesMore),
      })
      .then((user) => console.log("receipt stored"))
      .catch((error) => {
        console.log(error);
      });
  } else {
    // this is if user has not previously had a notifications, we'll create receipts attribute
    const updatedAttributes = {
      ...item.attributes,
      sentReceipts: [item.id],
    };
    // console.log(updatedAttributes);
    client.chat
      .services(serviceSid)
      .users(item.cell)
      .update({
        attributes: JSON.stringify(updatedAttributes),
      })
      .then((user) => console.log("receipt stored", user))
      .catch((error) => {
        console.log(error);
      });
  }
}

// Cron job here triggers the relevant functions for check and send notifications
// Frequency every 5 min, 24 hrs of activity (USGS could retrospectively add activity, not always real-time as they verify before adding)
// Sequence of events
//1. fetch latest earthquakes
//2. fetch users who signed up for notifications
//3. for each user, check each of the earthquakes for a match with attributes by calculating the distanceBetween and fetchCompare all handled by checkMatches
//4. returns array of matches in nicely formatted objects containing the info needed for the sms body
//5. map over the array of matches to send the sms notifications to users :-)

cron.schedule("0 */5 * * * *", () => {
  const resValues = getUsgs()
    .then((resValues) => {
      console.log(
        `**** there are currently ${resValues.length} earthquakes in the last 24hrs which could match a notification ****`
      );
      console.log(resValues);
      getTwilioUsers().then((resUsers) => {
        console.log(
          `**** there are currently ${resUsers.length} notifications which could match a activity ****`
        );
        const smsToSend = checkMatches(resValues, resUsers); //call function to check if any matches
        console.log("to send", smsToSend);
        if (smsToSend.length > 0) {
          console.log(`**** ${smsToSend.length} notification(s) to be sent:`);
          // Trigger SMS to be sent here by mapping over smsToSend
          // Ensure we add activity id to Twilio user attribute at this point to avoid duplicate notifications
          // Timeout delay to help Twilio Server

          smsToSend.forEach((item, i) => {
            setTimeout(() => {
              sendSms(item);
            }, i * 2000);
          });
        } else {
          console.log("**** no notifications to send ****");
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/signup-sms", async (req, res) => {
  const item = req.body;
  console.log(item);

  await sendFirstSms(item);
  res.status(200).json({
    message: "created",
  });
});

const sendFirstSms = (item) => {
  const twilio = require("twilio")(process.env.ACC_SID, process.env.TW_TOKEN);
  const body = `This is a notification from Faultline.app, you will now receive Earthquake alerts based on your location and selected distance range of ${item.distance}km`;
  const number = item.cell;
  twilio.messages
    .create({
      to: number,
      from: process.env.TWILIO_NUMBER,
      body: body,
    })
    .then((messages) => {
      console.log("Message sent", messages);
    })
    .catch((err) => console.error(err));
};

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

module.exports = router;
