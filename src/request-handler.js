const serveFile = require('./serve-file')
const streamMedia = require('./stream-media')


/** @module requestHandler
 * Responds to HTTP requests.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */
module.exports = function requestHandler(req, res) {
    // only accept get requests
    if (req.method !== 'GET') {
        res.statusCode = 501
        res.statusMessage = 'Not Implemented'
        res.end()
        return
    }
    
    if (req.headers.range)
        streamMedia(req, res)
    else
        serveFile(req, res)
}