const server = require('./server')

server.listen(5300, () => {
    console.log(`server is listening on http://localhost:5300`)
})