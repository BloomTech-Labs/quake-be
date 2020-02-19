const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const server = express()

// --middleware--
server.use(express.json())
server.use(cors())
server.use(helmet())
server.use(morgan('combined'))


module.exports = server