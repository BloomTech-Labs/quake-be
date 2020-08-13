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

//Add SMS endpoints here for POST, PUT, DELETE, GET, TEST
//
//
//POST: add member to twilios chat api with attributes provide by the front end form.

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
    .channels.create({
      uniqueName: user.cell,
      attributes: JSON.stringify(user)
    })
    .then((channel) => console.log(channel));
    //Eddie - add verification code here - check user owns the number//
    //router.get("/fetchVerifiedUser", async (req, res) => {
//     // const userSid = "CHba34fbcc81d544eb9cd98a7d4040bb58";
//     fetchMemberResource();
//     res.status(200).json({ message: "member fetched" });
//   });
  
//   function fetchMemberResource() {
//     const accountSid = process.env.ACC_SID;
//     const authToken = process.env.TW_TOKEN;
//     const serviceSid = process.env.SERVICE_SID;
//     const client = require("twilio")(accountSid, authToken);
  
//     client.chat.services(serviceSid)
//       .fetch()
//       .then((user) => console.log(user));
//   }

}

//Pete- Add Cron job here to check latest activity against notification table
// frequency every 5 min
// 12 hrs of activity
// Min Magnitude = 5 or user preference 
// Global
// check if there has been new activity since the last refresh (5 mins)

//Eddie- Fetch list of channels from Twilio


//Pete- Compare any new activity with criteria in the Twilio attributes

//Eddie & Pete- Check if any matches and confirm a match has not already been sent (avoid duplicates)

//Eddie- If new match, trigger an SMS notification...


//notes as reminder: How to ensure we don't send duplicate notifications for the same quake...
// We are going need some kind of ID to know if already be sent... where to store? Attribute to Twilio... history of notifications sent..
// add time/date stamp of when user was sent notifications



//Twilio SMS trigger for when activity matches item in notification table
// Your Account Sid and Auth Token from twilio.com/console
// Devs: Don't forget to add .env file locally with the secrets in Trello

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
