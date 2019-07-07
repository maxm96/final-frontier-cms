'use strict'

var http = require('http')
var requestHandler = require('./src/request-handler')
var createDatabase = require('./src/create-database')
var port = 3000

var server = http.createServer(requestHandler)

// initialize database
createDatabase((err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }    
  
  server.listen(port, () => console.log(`Server is listening on port ${port}`))
})