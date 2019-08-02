const generateCardHtml = require('./generate-card-html')


/** @module serveHomePage
 * Serves home page with cards information from db.
 * @param {httpPair} pair - the pair object
 */
module.exports = function serveHomePage(pair) {
  pair.db.readAll('card')
    .then(cards => success(pair, cards))
    .catch(err => failure(pair, err))
}

/** @function success
 * Serves the requested page after db success.
 * @param {httpPair} pair - the pair object
 * @param {array} cards - the cards retrieved from the db
 */
function success(pair, cards) {
  const cardsHtml = cards.length 
    ? generateCardsHtml(cards)
    : ''
  const html = pair.templates.render(
    'home.html', 
    { cardsHtml: cardsHtml }
  )
  
  pair.res.setHeader('Content-Type', 'text/html')
  pair.res.setHeader('Content-Length', html.length)
  pair.res.end(html)
}

/** @function failure
 * Serves a 500 error page after db error.
 * @param {httpPair} pair - the pair object
 * @param {string|object} err - the error object returned from db call
 */
function failure(pair, err) {
  console.error(err)
  pair.res.statusCode = 500
  pair.res.statusMessage = 'Server Error'
  pair.res.end()
}

/** @function generateCardsHtml
 * Generates HTML for each card in cards.
 * @param {array} cards - the array of cards
 * @returns {string} the full cards html
 */
function generateCardsHtml(cards) {
  var cardsHtml = cards.map(card => {
    return `
      <div class="card ${card.type}">
        ${generateCardHtml(card)}
      </div>
    `
  }).join('')
}