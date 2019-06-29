const fs = require('fs')
const url = require('url')
const path = require('path')


/** @module streamMedia 
 * Serves a portion of the requested video or audio file.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */ 
module.exports = function streamMedia(req, res) {
    // get the file path
    var pathname = url.parse(req.url).pathname
    var filePath = path.join('public', pathname)
    
    // set the content type header
    var typeHeader = 'Content-Type'
    switch (path.extname(filePath).toLowerCase()) {
        case '.mp3':
            res.setHeader(typeHeader, 'audio/mpeg')
            break
        case '.wav':
            res.setHeader(typeHeader, 'audio/wav')
            break
        case '.mp4':
            res.setHeader(typeHeader, 'video/mp4')
            break
        case '.mov':
            res.setHeader(typeHeader, 'video/quicktime')
            break
        default:
            res.setHeader(typeHeader, 'application/octet-stream')
    }
    
    // get byte ranges
    var byteRanges = /bytes=(\d+)-(\d*)/.exec(req.headers.range)
    var start = parseInt(byteRanges[1], 10)
    
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404
            res.statusMessage = 'Not Found'
            res.end()
            return
        }
        
        var end = byteRanges[2] ? parseInt(byteRanges[2], 10) : stats.size - 1
        
        // set length and range headers
        res.setHeader('Content-Length', end - start + 1)
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`)
        
        res.statusCode = 206
        res.statusMessage = 'Partial Content'
        
        // start a stream
        var stream = fs.createReadStream(filePath, {
            start: start,
            end: end,
        })
            .on('open', () => stream.pipe(res))
            .on('error', (err) => res.end(err))
    })
}