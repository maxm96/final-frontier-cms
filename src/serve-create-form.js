const parseBody = require('./parse-body')


/** @module serveCreateForm
 * Generates and serves HTML for card creation pages.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */
module.exports = function serveCreateForm(req, res) {
  parseBody(req, res, (req, res) => {
    var html = generateHTML(req.body.type)

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', html.length)
    res.end(html)
  })
}


/** @function generateHTML
 * Generates the HTML.
 * @param {string} cardType - the type of the card
 */
function generateHTML(cardType) {
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en-us">
        <title>Card Create</title>
        <link href="/assets/css/mockup.css" rel="stylesheet" type="text/css">
        <link href="/assets/css/final-frontier.css" rel="stylesheet" type="text/css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
      </head>
      <body>
        ${generateFormHTML(cardType)}
        <script src="/assets/js/final-frontier.js"></script>
      </body>
    </html>
  `
}


/** @function generateFormHTML
 * Generates an HTML form based on the supplied card type.
 * @param {string} cardType - the type of card to generate a form for
 */
function generateFormHTML(cardType) {
  // verbose but best i got
  var formTitle = `Create ${cardType.replace(cardType.charAt(0), cardType.charAt(0).toUpperCase())} Card`
  
  return `
    <div class="create-form create-${cardType}">
      <h1>${formTitle}</h1>
      <form method="POST" action="/create" enctype="multipart/form-data">
        <input type="hidden" name="type" value="${cardType}">
        ${generateFieldsets(cardType)}
        <input type="submit" value="Submit">
      </form>
    </div>
  `
}


/** @function generateFieldsets
 * Generates fieldset HTML based off supplied card type.
 * @param {string} cardType - the type of the card
 */
function generateFieldsets(cardType) {
  if (cardType === 'article') {
    return `
      <fieldset>
        <label for="title">Title:</label>
        <input type="text" name="title" required>
      </fieldset>
      <fieldset>
        <label for="body">Body:</label>
        <textarea rows="10" name="body" required></textarea>
      </fieldset>
    `
  } else {
    var capitalizedType = cardType.replace(
      cardType.charAt(0),
      cardType.charAt(0).toUpperCase()
    )
    var accept = cardType === 'gallery' ? 'image' : cardType
    var uploadType = cardType === 'gallery' ? 'multiple' : ''
    
    return `
      <fieldset>
        <label for="title">Title:</label>
        <input type="text" name="title" required>
      </fieldset>
      <fieldset>
        <label for="description">Description:</label>
        <textarea rows="10" name="description" required></textarea>
      </fieldset>
      <fieldset>
        <label for="source">${capitalizedType} File:</label>
        <input type="file" accept="${accept}/*" name="source" ${uploadType} required>
      </fieldset>
    `
  }
}