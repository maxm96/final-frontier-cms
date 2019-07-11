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
      case 'video':
        writeAndStoreResource(req.body, cb)
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

/** @function createGallery
 * Create a gallery resource.
 * @param {object} body - the body of the request
 * @param {createGallery~callback} cb - the callback to invoke when done
 */
function createGallery(body, cb) {
  // create gallery resource
  var gallery = {
    title: body.title,
    description: body.description,
    type: body.type,
  }
  
  dataStore.create(gallery, (err, galleryId) => {
    if (err)
      return cb(err)
    
    // make sure images directory exists
    var dirPath = 'public/media/images'
    
    mkdirp(dirPath, (err) => {
      if (err)
        return cb(err)
      
      // get array of file objects
      var files = Array.isArray(body.source) ? body.source : [body.source]
      
      // here we go
      var promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(`${dirPath}/${file.filename}`, file.data, (err) => {
            if (err)
              reject(err)
            resolve()
          })
        })
      })
      
      // create gallery image objects from files
      var galleryImages = files.map(file => {
        return {
          gallery_id: galleryId,
          source: `media/images/${file.filename}`
        }
      })
      
      // wait for promises to resolve and add gallery images to db
      Promise.all(promises).then(_ => dataStore.createGalleryImages(galleryImages, cb))
    })
  })
}

/** @callback createGallery~callback
 * The callback invoked by createGallery.
 * @param {string|objcet} err - any error that occurred or null if none
 */

/** @function writeAndStoreResource
 * Write uploaded file to filesystem and create a resource in db.
 * @param {object} body - the request body
 * @param {writeAndStoreResource~callback} cb - the callback to invoke when done
 */
function writeAndStoreResource(body, cb) {
  var dirPath = `public/media/${body.type}`
  
  // create directory if it doesn't exist
  mkdirp(dirPath, (err) => {
    if (err)
      return cb(err)
    
    // write file data to filesystem
    fs.writeFile(`${dirPath}/${body.source.filename}`, body.source.data, (err) => {
      if (err)
        return cb(err)
      
      // do not save full public path to db
      var storedPath = `media/${body.type}/${body.source.filename}`
      
      // insert resource into db
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

/** @callback writeAndStoreResource~callback
 * The callback invoked by writeAndStoreResource.
 * @param {string|object} err - any error that occurred or null if none
 */