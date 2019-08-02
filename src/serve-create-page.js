const extendTemplate = require('./extend-template')


/** @module serveCreatePage
 * Serves the card creation pages.
 * @param {httpPair} pair - the pair object
 */
module.exports = function serveCreatePage(pair) {
  var cardType = pair.req.body.type
  var formTitle = `Create ${cardType.replace(cardType.charAt(0), cardType.charAt(0).toUpperCase())} Card`
  
  const html = extendTemplate(
    pair,
    { 
      template: 'create.html', 
      variables: {
        cardType: cardType,
        formTitle: formTitle,
        fieldSets: generateFieldSets(cardType)
      }
    },
    {
      template: 'base.html',
      variables: { title: formTitle }
    }
  )
  
  pair.res.setHeader('Content-Type', 'text/html')
  pair.res.setHeader('Content-Length', html.length)
  pair.res.end(html)
}

/** @function generateFieldSets
 * Generates form field sets based on the card type provided.
 * @param {string} cardType - the type of the card
 * @returns {string} html fieldsets
 */
function generateFieldSets(cardType) {
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
  }
  
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