const express = require('express');

const messageRouter = require('./message/messageRouter')

const server = express()

server.use(express.json())

server.use('/api/posts', messageRouter)

module.exports = server;