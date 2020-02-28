// Server configuration here. 

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

// const authenticate = require("../auth/authentication-middleware.js");
const authRouter = require("../auth/auth-router.js");
// const usersRouter = require("../users/users-router.js");


const server = express()

// --middleware--
server.use(express.json())
server.use(cors())
server.use(helmet())
server.use(morgan('combined'))
server.use("/api/auth", authRouter);
// server.use("/api/users", authenticate, usersRouter);

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
  });
  
  




module.exports = server;