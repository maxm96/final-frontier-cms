'use strict'

var http = require('http')
var requestHandler = require('./src/request-handler')
var port = 3000

var server = http.createServer(handleRequest)

server.listen(port, function () {
    console.log('Server is listening on port ' + port)
})