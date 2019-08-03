const extendTemplate = require('./extend-template')


/** @module serveSignup
 * Serves the signup page.
 * @param {httpPair} pair - the pair object
 * @param {string} errorMessage [optional] - any error message
 */
module.exports = function serveSignup(pair, errorMessage = '') {
  var html = extendTemplate(
    pair, 
    { template: 'signup.html', variables: { errorMessage: errorMessage } }, 
    { template: 'base.html', variables: { title: 'Sign Up' } }
  )
  
  pair.res.setHeader('Content-Type', 'text/html')
  pair.res.setHeader('Content-Lenth', html.length)
  pair.res.end(html)
}