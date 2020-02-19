require('dotenv').config()
const server = require('./server')

const PORT = process.env.PORT || 3000;

server.get('/', (req, res) => {
    res.send(`
    <div>
        <h1>Welcome to DadJokes Api</h1>
      
    </div>
    `)
})

// -- final middleware --
server.use(function (req, res) {
    res.status(404).send(`
    <div>
        <h1>that page doesnt exist..</h1>
    </div>
    `);
})

server.listen(PORT, () => {
    console.log(`********//   API OPEN ON PORT ${PORT}  //********`)
})