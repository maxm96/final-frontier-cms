const fs = require('fs')
const determineContentType = require('./determine-content-type')

/** @module serveFile 
 * Provides a function for serving files in the public directory matching the pathname in the req.url. 
 * @param {string} filePath - the path to the file
 * @param {http.serverResponse} res - the response object
 * @param {serveFile-callback} callback - a callback function to invoke upon execution
 */
module.exports = function serveFile(filePath, res, callback) {
  // read the file asynchronously
  fs.readFile(filePath, (err, body) => {
    if (err)
      return callback(err)
    
    // set the Content-Length
    res.setHeader('Content-Length', body.length)
    
    // set the Content-Type
    res.setHeader('Content-Type', determineContentType(filePath))
    
    // and serve
    res.end(body)
  });
}