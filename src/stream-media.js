const fs = require('fs')
const determineContentType = require('./determine-content-type')

/** @module streamMedia 
 * Serves a portion of the requested video or audio file.
 * @param {string} filePath - the path to the file
 * @param {object} stats - file stats
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */ 
module.exports = function streamMedia(filePath, stats, req, res) {
  // set the content type header
  res.setHeader('Content-Type', determineContentType(filePath))

  // get byte ranges
  var byteRanges = /bytes=(\d+)-(\d*)/.exec(req.headers.range)
  var start = parseInt(byteRanges[1], 10)
  var end = byteRanges[2] ? parseInt(byteRanges[2], 10) : stats.size - 1

  // set headers
  res.setHeader('Content-Length', end - start + 1)
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`)
  
  // set status code and status message
  res.statusCode = 206
  res.statusMessage = 'Partial Content'
  
  // start a stream
  var stream = fs.createReadStream(filePath, {
    start: start,
    end: end,
  })
    .on('open', () => stream.pipe(res))
    .on('error', (err) => res.end(err))
}