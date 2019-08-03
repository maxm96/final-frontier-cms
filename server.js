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
const serveAdminPage = require('./src/serve-admin-page')
const serveCreatePage = require('./src/serve-create-page')
const createCard = require('./src/create-card')
const serveSignup = require('./src/serve-signup')
const serveSignin = require('./src/serve-signin')
const createUser = require('./src/create-user')
const createAuthSession = require('./src/create-auth-session')

// set get routes
router.addRoute('GET', '/', serveHomePage)
router.addRoute('GET', '/admin', serveAdminPage)
router.addRoute('GET', '/signup', serveSignup)
router.addRoute('GET', '/signin', serveSignin)
router.addRoute('GET', '/public/.+', staticContentServer.serveContent)

// set post routes
router.addRoute('POST', '/create-page', pair => {
  wf.bodyParser(pair)
    .then(serveCreatePage)
    .catch(err => console.error(err))
})
router.addRoute('POST', '/create', pair => {
  wf.bodyParser(pair)
    .then(createCard)
    .then(serveHomePage)
    .catch(err => console.error(err))
})
router.addRoute('POST', '/signup', pair => {
  wf.bodyParser(pair)
    .then(wf.memorySession)
    .then(createUser)
    .then(serveHomePage)    
    .catch(err => {
      console.error(err)
      serveSignup(pair, err)
    })
})
router.addRoute('POST', '/signin', pair => {
  wf.bodyParser(pair)
    .then(wf.memorySession)
    .then(createAuthSession)
    .then(serveHomePage)
    .catch(err => {
      console.error(err)
      serveSignin(pair, err)
    })
})

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