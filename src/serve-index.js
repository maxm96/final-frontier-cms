/** This module is broken **/

const fs = require('fs')
const path = require('path')
const serveFile = require('./serve-file')

/** @function serveIndex~callback
 * @param {string|object} error - any error encountered by serveIndex
 */ 

/** @module serveIndex
 * Generates a dynamic index page for a directory's contents
 * @param {string} filePath - the path to the directory
 * @param {http.serverResponse} res - the response object
 * @param {serveIndex~callback} callback - the callback to
 * invoke once execution finishes
 */
module.exports = function serveIndex(filePath, res, callback) {
  serveFile(path.join(filePath, 'index.html'), res, (err) => {
    if (err)
      serveIndexListing(filePath, res, callback)
    else
      callback(null)
  })
}

/** @callback serveIndexListing~callback
 * @param {string|object} err - an error that occuerd
 */

/** @function serveIndexListing
 * Serves an HTML list of directory contents.
 * @param {string} directoryPath - the path to the directory
 * @param {http.serverResponse} res - the response object
 * @param {serveIndexListing~callback} callback - a callback
 * to invoke once execution finishes.
 */
function serveIndexListing(directoryPath, res, callback) {
  generateIndexHTML(directoryPath, (err, html) => {
    if (err)
      return callback(err)
    
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', html.length)
    res.end(html)
  })
}

/** @function generateIndexHTML
 * Generates a HTML page listing the contents of a directory
 * @param {string} dirPath - the path to the directory
 * @param {generateIndexHTML-callback} callback - a callback
 * to invoke once execution completes
 */ 
function generateIndexHTML(dirPath, callback) {
  fs.readdir(dirPath, function (err, items) {
    if (err)
      return err
    
    // create Links
    var links = items.map(function(item) {
      return `<li><a href="${path.join(dirPath, item)}">${item}</a></li>`
    });
    // generate HTML
    var html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Index of ${dirPath}</title>
        <head>
        <body>
          <h1>Index of ${dirPath}</h1>
          <ul>
            ${links.join("")}
          <ul>
        </body>
      <html>
    `
    
    callback(null, html)
  })
}
