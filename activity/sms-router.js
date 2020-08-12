const express = require('express');
const axios = require('axios');
// const Sms = require('./sms-model.js'); //Add this model for SMS table db actions.
const cron = require('node-cron');
require('dotenv').config()
const turf = require('turf');
const { ConversationPage } = require('twilio/lib/rest/conversations/v1/conversation');



// '/api/sms'
const router = express.Router();

//Add SMS endpoints here for POST, PUT, DELETE, GET, TEST
//
//
router.get("/test", async (req, res) => {
    TwilioTrigger(process.env.MY_CELL, 'Faultline test!!'); //toNum and Msg variables
    res.status(200).json({ message: 'test Twilio sms has been triggered to the number in .env'})
});


//Add Cron job here to check latest activity against notification table
//
//


//Twilio SMS trigger for when activity matches item in notification table
// Your Account Sid and Auth Token from twilio.com/console
// Devs: Don't forget to add .env file locally with the secrets in Trello
function TwilioTrigger(toNum, Msg) {
    const accountSid = process.env.ACC_SID;
    const authToken = process.env.TW_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    client.messages
      .create({
         body: Msg,
         from: '+14439927460',
         to: toNum
       })
      .then(message => console.log(message.sid));
}


// [long, lat], [long, lat] ***caution that longitude is first param and latitude is second param***
// example: distanceBetween([-75.343, 39.984], [-75.534, 39.123]) should provide distance of 97.16km
function distanceBetween(from, to) {
  const fromCoords = turf.point(from);
  const toCoords = turf.point(to);
  console.log(fromCoords, toCoords)

  const distance = turf.distance(fromCoords, toCoords).toFixed(2); // result is in km
  return distance
}

module.exports = router, { distanceBetween, };

