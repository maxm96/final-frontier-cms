/** @module requireAuth
 * Checks to make sure the user is authenticated.
 * If not, redirects them to the GET /signin route.
 * @param {HttpPair} pair - the request and response objects
 */
module.exports = function requireAuth(pair) {
  if (!pair.session || !pair.session.user) {
    return Promise.reject(pair)
  }
  
  return Promise.resolve(pair)
}