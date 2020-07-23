const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();

const ActivityRouter = require('./activity/activity-router')
const NukesRouter = require('./activity/nukes-router')
const TsunamiRouter = require('./activity/tsunami-router')


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/api/activity',ActivityRouter);
server.use('/api/nukes', NukesRouter);
server.use('/api/tsunami', TsunamiRouter);


server.get('/', (req, res) => {
    res.status(201).json({ message: 'hello world' });
});

module.exports = server;