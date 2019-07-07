const fs = require('fs')
const generateCardHTML = require('./generate-card-html')
const dataStore = require('./data-store')

/** @callback serveMain~callback
 * @param {string|object} err - any error encountered
 */ 

/** @module serveMain
 * Serves the generated HTML of the main page.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {serveMain~callback} callback - callback to invoke after encountering an error
 */ 
module.exports = function serveMain(req, res, callback) {
  // read from database
  dataStore.readAll((err, items) => {
    if (err)
      callback(err)
    
    console.log(items)
    
    var html = generateMainHTML(items)
    
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', html.length)
    
    res.end(html)
  })
}

/** @function generateMainHTML
 * Generates the main page HTML.
 * @param {array} cards - all card data
 */ 
function generateMainHTML(cards) {  
  // map over cards, generating html blocks wrapped in a card div for each
  var cardsHTML = cards.map((card) => {
    return `
      <div class="card ${card.type}">
        ${generateCardHTML(card)}
      </div>
    `
  }).join('')
  
  // return main html document with inserted card html
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en-us">
        <title>Final Frontier</title>
        <link href="assets/css/mockup.css" rel="stylesheet" type="text/css">
        <link href="assets/css/final-frontier.css" rel="stylesheet" type="text/css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
      </head>
      <body>
        <div class="main-page">
          <h1>Final Frontier</h1>
          <div style="text-align: center; margin-bottom: 25px;">
            <span class="search-bar">
              <input type="text" name="search">
              <button class="search-btn">Search</button>
            </span>
          </div>
          <div class="cards">
            ${cardsHTML}
          </div>
        </div>
        <script src="assets/js/final-frontier.js"></script>
      </body>
    </html>
  `
}