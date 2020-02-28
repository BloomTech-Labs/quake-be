require('dotenv').config()
const server = require('./api/server.js')

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`********//   API OPEN ON PORT ${PORT}  //********`)
})