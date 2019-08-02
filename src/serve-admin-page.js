/** @module serveAdminPage
 * Serves the admin page.
 * @param {httpPair} pair - the pair object
 */
module.exports = function serveAdminPage(pair) {
  const cardTypes = ['article', 'audio', 'gallery', 'video']
  const html = pair.templates.render('admin.html', { cardTypes: cardTypes })
  
  pair.res.setHeader('Content-Type', 'text/html')
  pair.res.setHeader('Content-Length', html.length)
  pair.res.end(html)
}