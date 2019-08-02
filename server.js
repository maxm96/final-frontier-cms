'use strict'

const http = require('http')

// server modules
const wf = require('web-framework')
const DataStore = require('./src/data-store')

// server port
const port = 3000

// instantiate classes
var templates = new wf.TemplateEngine('templates')
var router = new wf.Router()
var staticContentServer = new wf.StaticContentServer('public')

// initialize db
var db = new DataStore()

// endpoints
const serveHomePage = require('./src/serve-home-page')

// set routes
router.addRoute('GET', '/', serveHomePage)
router.addRoute('GET', '/public/.+', staticContentServer.serveContent)


// instantiate server
var server = http.createServer((req, res) => {
  var pair = new wf.HttpPair(
    req, 
    res, 
    { 
      db: db, 
      templates: templates
    }
  )
  
  pair.then(router.route).catch(err => {
    console.error(err)
    res.statusCode = 500
    res.statusMessage = 'Server Error'
    res.end()
  })
})

server.listen(port, () => console.log(`Server listening on port ${port}`))