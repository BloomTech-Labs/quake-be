const express = require('express');
const axios = require('axios');
// const Sms = require('./sms-model.js'); //Add this model for SMS table db actions.
const cron = require('node-cron');


// '/api/sms'
const router = express.Router();

//Add SMS endpoints here for POST, PUT, DELETE, GET
//
//



//Add Cron job here to check latest activity against notification table
//
//


//Twilio SMS trigger for when activity matches item in notification table
//
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.ACC_SID;
const authToken = process.env.TW_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+15017122661',
     to: '+15558675310'
   })
  .then(message => console.log(message.sid));



module.exports = router;