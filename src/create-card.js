const fs = require('fs')
const mkdirp = require('mkdirp')
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
  console.log(body)
  dataStore.create(
    {
      title: body.title,
      body: body.body,
      type: body.type,
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
function createAudio(body, cb) {
  var dirPath = 'public/media/audio'
  
  // create directory if not exists
  mkdirp(dirPath, (err) => {
    if (err)
      return cb(err)
    
    // write file to filesystem
    fs.writeFile(`${dirPath}/${body.source.filename}`, body.source.data, (err) => {
      if (err)
        return cb(err)
      
      // do not save full filepath in db as it is computed later
      var storedPath = `media/audio/${body.source.filename}`
      
      // insert record into database
      dataStore.create(
        {
          title: body.title,
          description: body.description,
          source: storedPath,
          type: body.type,
        },
        cb
      )
    })
  })
}

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