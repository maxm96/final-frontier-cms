/** @module serveError
 * Logs an error and serves an HTTP response with specified status code.
 * @param {string|object} err - the error
 * @param {integer} code - the error status code
 * @param {string} message - the status message
 * @param {http.serverResponse} res - the response object
 */
module.exports = function serveError(err, code, message, res) {
  // log the error
  if (err)
      console.error(err)
  // send the response
  res.statusCode = code
  res.statusMessage = message
  res.end()
}