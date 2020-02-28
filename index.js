require('dotenv').config()
const server = require('./api/server.js')

const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});


server.listen(PORT, () => {
    console.log(`********//   API OPEN ON PORT ${PORT}  //********`)
})