// Server configuration here. 
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const authenticate = require("../auth/authentication-middleware.js");
// const authRouter = require("../auth/auth-router.js");
// const usersRouter = require("../users/users-router.js");

// const server = express();

// server.use(helmet());
// server.use(cors());
// server.use(express.json());





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





module.exports = server;