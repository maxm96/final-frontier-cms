const parseBody = require('./parse-body')
const dataStore = require('./data-store')


/** @module createCard
 * Handles the creation of new cards.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {createCard~callback} cb - the callback to invoke when done
 */
module.exports = function createCard(req, res, cb) {
  parseBody(req, res, (req, res) => {
    console.log(req)
    
    switch (req.body.type) {
      case 'article':
        createArticle(req.body, cb)
        break
      case 'audio':
        createAudio(req.body, cb)
        break
      case 'video':
        createVideo(req.body, cb)
        break
      case 'gallery':
        createGallery(req.body, cb)
        break
    }
  })
}

/** @callback createCard~callback
 * The callback invoked by createCard.
 * @param {string|object} err - any errors that occured or null if none
 */

/** @function createArticle
 * Create an article resource.
 * @param {object} body - the body of the request
 * @param {createArticle~callback} cb - the callback to invoke when done
 */
function createArticle(body, cb) {
  dataStore.create(
    'article',
    {
      title: body.title,
      body: body.body,
    },
    cb
  )
}

/** @callback createArticle~callback
 * The callback invoked by createArticle.
 * @param {string|object} err - any errors that occured or null if none
 */

/** @function createAudio
 * Create an audio resource.
 * @param {object} body - the body of the request
 * @param {createAudio~callback} cb - the callback to invoke when done
 */
function createAudio(body, cb) {}

/** @callback createAudio~callback
 * The callback invoked by createAudio.
 * @param {string|object} err - any error that occured or null if none
 */

/** @function createVideo
 * Create a video resource.
 * @param {object} body - the body of the request
 * @param {createVideo~callback} cb - the callback to invoke when done
 */
function createVideo(body, cb) {}

/** @callback createVideo~callback
 * The callback invoked by createVideo.
 * @param {string|object} err - any error that occurred or null if none
 */

/** @function createGallery
 * Create a gallery resource.
 * @param {object} body - the body of the request
 * @param {createGallery~callback} cb - the callback to invoke when done
 */
function createGallery(body, cb) {}

/** @callback createGallery~callback
 * The callback invoked by createGallery
 * @param {string|objcet} err - any error that occurred or null if none
 */