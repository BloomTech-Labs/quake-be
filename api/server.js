// Server configuration here. 
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authenticate = require("../auth/authentication-middleware.js");
const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/api/auth", authRouter);
server.use("/api/users", authenticate, usersRouter);


server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;