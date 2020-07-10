const server = require('./server.js');

const cron = require('node-cron');
const axios = require('axios');
const PORT = process.env.PORT || 5001;

// cron.schedule('*/10 * * * * *', () => {
//   console.log('running a task every minute');
//   axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=2')
//   .then(response=>console.log(response.data))
//   .catch(error=>console.log(error))
// });

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});