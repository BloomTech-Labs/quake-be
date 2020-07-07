const express = require('express');
const helmet = require('helmet');
const server = express();

const ActivityRouter = require('./activity/activity-router')

server.use(helmet());
server.use(express.json());
server.use('/api/activity',ActivityRouter);

module.exports = server;