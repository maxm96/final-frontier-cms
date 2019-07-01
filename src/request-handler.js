const fs = require('fs')
const url = require('url')
const path = require('path')
const serveMain = require('./serve-main')
const serveFile = require('./serve-file')
const serveIndex = require('./serve-index')
const streamMedia = require('./stream-media')
const serveError = require('./serve-error')


/** @module requestHandler
 * Responds to HTTP requests.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */
module.exports = function requestHandler(req, res) {
  // only accept get requests
  if (req.method !== 'GET') {
    serveError(null, 501, 'Not Implemented', res)
    return
  }
  
  if (req.url === '/') {
    // serve main page
    serveMain(req, res, (err) => serveError(err, 500, 'Server Error', res))
  } else {
    // not main page -- get pathname and invoke stat
    var pathname = url.parse(req.url).pathname
    var filePath = path.join('public', pathname)
    
    // decode file path to prevent errors from paths with spaces
    filePath = decodeURIComponent(filePath)
    
    fs.stat(filePath, (err, stats) => {
      if (err)
        return serveError(err, 404, 'Not Found', res)
      
      if (stats.isFile()) { // serve file resource
        if (req.headers.range) // stream if range is requested
          streamMedia(filePath, stats, req, res)
        else // else serve entire file
          serveFile(filePath, res, (err) => {
            if (err)
              serveError(err, 500, 'Server Error', res)
          })
      } else if (stats.isDirectory()) { // serve index directory
        /** TODO: index links are broken **/
        serveIndex(filePath, res, (err) => {
          if (err)
            serveError(err, 500, 'Server Error', res)
        })
      } else {
        serveError(null, 404, 'Not Found', res)
      }
    })
  }
}