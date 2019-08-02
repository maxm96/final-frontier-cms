const generateCardHtml = require('./generate-card-html')
const extendTemplate = require('./extend-template')


/** @module serveHomePage
 * Serves home page with cards information from db.
 * @param {httpPair} pair - the pair object
 */
module.exports = function serveHomePage(pair) {
  pair.db.readAll('card')
    .then(cards => getGalleryImages(pair, cards))
    .then(cards => success(pair, cards))
    .catch(err => failure(pair, err))
}

/** @function getGalleryImages
 * Gets gallery images and attaches them to gallery object.
 * @param {httpPair} pair - the pair object
 * @param {array} cards - array of card objects
 * @return {Promise} resolves to altered cards array
 */
function getGalleryImages(pair, cards) {
  // it's promises all the way down
  return new Promise((resolve, reject) => {
    Promise.all(
      cards.filter(card => card.type === 'gallery').map(gallery => {
        return new Promise((res, rej) => {
          pair.db.readGalleryImages(gallery.id)
            .then(rows => {
              cards[cards.findIndex(card => card.id === gallery.id)]['images'] = rows
              res()
            })
            .catch(err => rej(err))
        })
      })
    ).then(_ => resolve(cards)).catch(err => reject(err))
    
  })
}

/** @function success
 * Serves the requested page after db success.
 * @param {httpPair} pair - the pair object
 * @param {array} cards - the cards retrieved from the db
 */
function success(pair, cards) {
  const cardsHtml = generateCardsHtml(cards)
  
  const html = extendTemplate(
    pair,
    { template: 'home.html', variables: { cardsHtml: cardsHtml } },
    { template: 'base.html' }
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
  // TODO: move this to template engine
  return cards.map(card => {
    return `
      <div class="card ${card.type}">
        ${generateCardHtml(card)}
      </div>
    `
  }).join('')
}