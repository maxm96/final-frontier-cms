const cardTypes = ['article', 'audio', 'gallery', 'video']


/** @module serveAdmin
 * Generates and serves the HTML for the admin page.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */
module.exports = function serveAdmin(req, res) {
  var html = generateHTML()
  
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', html.length)
  res.end(html)
}


/** @function generateHTML
 * Generatse the HTML to serve.
 */
function generateHTML() {
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en-us">
        <title>Admin</title>
        <link href="assets/css/mockup.css" rel="stylesheet" type="text/css">
        <link href="assets/css/final-frontier.css" rel="stylesheet" type="text/css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
      </head>
      <body>
        <div class="admin-page">
          <h1>Pick a Type</h1>
          <div class="upload-buttons">
            ${cardTypes.map((type) => {
              return `
                <form method="POST" action="/create-form">
                  <input type="hidden" name="type" value="${type}">
                  <input type="submit" value="${type.replace(type.charAt(0), type.charAt(0).toUpperCase())}">
                </form>
              `
            }).join('')}
          </div>
        </div>
        <script src="assets/js/final-frontier.js"></script>
      </body>
    </html>
  `
}