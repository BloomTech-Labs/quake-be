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




module.exports = router;