const fs = require('fs')
const generateCardHTML = require('./generate-card-html')

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
  // read cards json
  fs.readFile('data/cards.json', { encoding: 'utf-8' }, (err, cards) => {
    if (err)
      callback(err)
    
    console.log(cards)
    
    // generate html
    var html = generateMainHTML(JSON.parse(cards))
    
    // set type and length headers
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', html.length)
    
    // and serve
    res.end(html)
  })
}

/** @function generateMainHTML
 * Generates the main page HTML.
 * @param {array} cards - all card data
 */ 
function generateMainHTML(cards) {
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en-us">
        <title>Final Frontier</title>
        <link href="assets/css/mockup.css" rel="stylesheet" type="text/css">
        <link href="assets/css/final-frontier.css" rel="stylesheet" type="text/css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            ${cards.map(card => `<div class="card">${generateCardHTML(card)}</div>`).join('')}
          </div>
        </div>
        <script src="assets/js/final-frontier.js"></script>
      </body>
    </html>
  `
}