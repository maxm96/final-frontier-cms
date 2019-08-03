const extendTemplate = require('./extend-template')

/** @module serveSignin
 * Serves the signin page.
 * @param {httpPair} pair - the pair object
 * @param {string} errorMessage [optional] - any error message
 */
module.exports = function serveSignin(pair, errorMessage = '') {
  const html = extendTemplate(
    pair, 
    { template: 'signin.html', variables: { errorMessage: errorMessage } }, 
    { template: 'base.html', variables: { title: 'Sign In' } }
  )
  
  pair.res.setHeader('Content-Type', 'text/html')
  pair.res.setHeader('Content-Length', html.length)
  pair.res.end(html)
}