const fs = require('fs')
const url = require('url')
const path = require('path')


/** @module serveFile
 * Serves a file located in the public directory.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object 
 */
module.exports = function serveFile(req, res) {
    // get file path
    var pathname = url.parse(req.url).pathname
    var filePath = path.join('public', pathname)
    
    fs.readFile(filePath, function (err, body) {
        if (err) {
            res.statusCode = 404
            res.statusMessage = 'Not Found'
            res.end()
            return
        }
        
        // set length header
        res.setHeader('Content-Length', body.length)
        
        // set type header
        var typeHeader = 'Content-Type'
        switch (path.extname(filePath).toLowerCase()) {
            /** text **/
            case '.txt':
                res.setHeader(typeHeader, 'text/plain')
                break
            case '.html':
            case '.htm':
                res.setHeader(typeHeader, 'text/html')
                break
            case '.css':
                res.setHeader(typeHeader, 'text/css')
                break
            case '.js':
            case '.mjs':
                res.setHeader(typeHeader, 'text/javascript')
                break
            case '.csv':
                res.setHeader(typeHeader, 'text/csv')
                break
            case '.ics':
                res.setHeader(typeHeader, 'text/calendar')
                break
            case '.xml':
                res.setHeader(typeHeader, 'text/xml')
                break
            /** font **/
            case '.woff':
                res.setHeader(typeHeader, 'font/woff')
                break
            case '.woff2':
                res.setHeader(typeHeader, 'font/woff2')
                break
            case '.ttf':
                res.setHeader(typeHeader, 'font/ttf')
                break
            case '.otf':
                res.setHeader(typeHeader, 'font/otf')
                break
            /** image **/
            case '.bmp':
                res.setHeader(typeHeader, 'image/bmp')
                break
            case '.gif':
                res.setHeader(typeHeader, 'image/gif')
                break
            case '.ico':
                res.setHeader(typeHeader, 'image/vnd.microsoft.icon')
                break
            case '.jpeg':
            case '.jpg':
                res.setHeader(typeHeader, 'image/jpeg')
                break
            case '.png':
                res.setHeader(typeHeader, 'image/png')
                break
            case '.svg':
                res.setHeader(typeHeader, 'image/svg+xml')
                break
            case '.tif':
            case '.tiff':
                res.setHeader(typeHeader, 'image/tiff')
                break
            case '.webp':
                res.setHeader(typeHeader, 'image/webp')
                break
            /** audio **/
            case '.mp3':
                res.setHeader(typeHeader, 'audio/mpeg')
                break
            case '.wav':
                res.setHeader(typeHeader, 'audio/wav')
                break
            /** video **/
            case '.mp4':
                res.setHeader(typeHeader, 'video/mp4')
                break
            case '.mov':
                res.setHeader(typeHeader, 'video/quicktime')
                break
            /** application **/
            case '.doc':
                res.setHeader(typeHeader, 'application/msword')
                break
            case '.docx':
                res.setHeader(typeHeader, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                break
            case '.json':
                res.setHeader(typeHeader, 'application/json')
                break
            case '.jsonld':
                res.setHeader(typeHeader, 'application/ld+json')
                break
            case '.odp':
                res.setHeader(typeHeader, 'application/vnd.oasis.opendocument.presentation')
                break
            case '.ods':
                res.setHeader(typeHeader, 'application/vnd.oasis.opendocument.spreadsheet')
                break
            case '.odt':
                res.setHeader(typeHeader, 'application/vnd.oasis.opendocument.text')
                break
            case '.pdf':
                res.setHeader(typeHeader, 'application/pdf')
                break
            case '.ppt':
                res.setHeader(typeHeader, 'application/vnd.ms-powerpoint')
                break
            case '.pptx':
                res.setHeader(typeHeader, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
                break
            case '.tar':
                res.setHeader(typeHeader, 'application/x-tar')
                break
            case '.xml':
                res.setHeader(typeHeader, 'application/xml')
                break
            case '.xhtml':
                res.setHeader(typeHeader, 'application/xhtml+xml')
                break
            case '.xls':
                res.setHeader(typeHeader, 'application/vnd.ms-excel')
                break
            case '.xlsx':
                res.setHeader(typeHeader, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                break
            case '.zip':
                res.setHeader(typeHeader, 'application/zip')
                break
            default:
                res.setHeader(typeHeader, 'application/octet-stream')
        }
        
        res.end(body)
    })
}