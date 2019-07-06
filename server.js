'use strict'

var http = require('http')
var requestHandler = require('./src/request-handler')
var createDatabase = require('./src/create-database')
var port = 3000

var server = http.createServer(requestHandler)

// initialize database
createDatabase(() => {
  console.log('Initialization complete')
  server.listen(port, () => console.log(`Server is listening on port ${port}`))
})