const querystring = require('querystring')


/** @module parseBody
 * Download and parse incoming request body.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {parseBody~callback} cb - the callback invoked when done
 */
module.exports = function parseBody(req, res, cb) {
  var chunks = []
  
  // push chunks of request as they arrive
  req.on('data', chunk => chunks.push(chunk))
  
  req.on('end', () => {
    var buff = Buffer.concat(chunks)
    
    switch (req.headers['content-type'].split(';')[0]) {
      case 'application/x-www-form-urlencoded':
        req.body = querystring.parse(buff.toString())
        return cb(req, res)
      case 'multipart/form-data':
        try {
          var match = /boundary=(.+)$/.exec(req.headers['content-type'])
          var boundary = match[1]
          
          req.body = parseMultipart(buff, boundary)
          return cb(req, res)
        } catch (err) {
          console.error(err)
          res.statusCode = 422
          res.statusMessage = 'Unprocessable Entity'
          res.end()
        }
        break
      case 'text/plain':
        req.body = buff.toString()
        return cb(req, res)
      default:
        res.statusCode = 400
        res.statusMessage = 'Bad Request'
        res.end()
    }
  })
  
  req.on('error', (err) => {
    console.error(err)
    res.statusCode = 400
    res.statusMessage = 'Bad Request'
    res.end()
  })
}

/** @callback parseBody~callback
 * Callback function for the parseBody method.
 * The parsed body is attached to the req object.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */

/** @function parseMultipart
 * Parses a buffer using 'mulipart/form-data' encoding
 * and returns it as an object of key/value pairs.
 * @param {Buffer} buffer - the buffer of multipart data
 * @param {string} boundary - the boundary bytes separating the parts
 * @returns {object} an object of key/value pairs
 */
function parseMultipart(buffer, boundary) {
  var formData = {}
  splitContentParts(buffer, boundary).forEach((content) => {
    var parts = parseContentPart(content)
    
    // hanlde multi file uploads
    if (formData[parts[0]]) { // input field already exists in form data
      if (!Array.isArray(formData[parts[0]])) {
        // turn formData[parts[0]] into an array
        formData[parts[0]] = [formData[parts[0]]]
      }

      // push files on array
      formData[parts[0]].push(parts[1])
    } else {
      formData[parts[0]] = parts[1]
    }
  })
  
  return formData
}

/** @function parseContentPart
 * @param {Buffer} content - the content part to parse
 * @returns {Array} a key/value pair as a two-element array
 */
function parseContentPart(content) {
  // 0x0D -- line end
  // 0x0A -- character feed
  const separator = Buffer.from([0x0D, 0x0A, 0x0D, 0x0A])
  
  var index = content.indexOf(separator)
  var head = content.slice(0, index)
  var body = content.slice(index + 4)
  
  // get name and filename fields from header
  var nameMatch = /name="([^"]+)"/.exec(head)
  var filenameMatch = /filename="([^"]+)"/.exec(head)
  
  if (filenameMatch) {
    // content is a file input field
    var contentTypeMatch = /Content-Type:\s?(\S+)/.exec(head)
    var contentType = contentTypeMatch && contentTypeMatch[1]
      ? contentTypeMatch[1]
      : 'application/octet-stream'
    
    return [nameMatch[1], {
      filename: filenameMatch[1],
      contentType: contentType,
      data: body,
    }]
  } else {
    // content is non-file input field
    return [nameMatch[1], body.toString()]
  }
}

/** @function splitContentParts
 * Splits a multipart body into the individual 
 * content parts using the supplied boundary bytes.
 * @param {Buffer} buffer - the multipart body to split
 * @param {string} boundary - the bytes that separate content parts in the buffer
 * @returns {Buffer[]} the separated content parts as a buffer array
 */
function splitContentParts(buffer, boundary) {
  var parts = []
  var boundaryBytes = `--${boundary}`
  var start = buffer.indexOf(boundaryBytes) + boundaryBytes.length
  var end = buffer.indexOf(boundaryBytes, start)
  
  while (end !== -1) {
    parts.push(buffer.slice(start, end - 2)) // -2 for CLRF
    start = end + boundaryBytes.length
    end = buffer.indexOf(boundaryBytes, start)
  }
  
  return parts
}