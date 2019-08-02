const fs = require('fs')
const mkdirp = require('mkdirp')


/** @module createCard
 * Creates a card resource in the database.
 * @param {httpPair} pair - the pair object
 * @returns {Promise} resolves to an httpPair object
 */
module.exports = function createCard(pair) {
  switch (pair.req.body.type) {
    case 'article':
      return createArticle(pair)
    case 'audio':
    case 'video':
      return createAudioOrVideo(pair)
    case 'gallery':
      return createGallery(pair)
  }
}

/** @function createArticle
 * Creates an article resource in the database.
 * @param {httpPair} pair - the pair object
 * @returns {Promise} resolves to an httpPair object
 */
function createArticle(pair) {
  return new Promise((resolve, reject) => {
    var article = {
      title: pair.req.body.title,
      body: pair.req.body.body,
      type: pair.req.body.type
    }
    
    pair.db.create('card', article)
      .then(_ => resolve(pair))
      .catch(err => reject(err))
  })
}

/** @function createAudioOrVideo
 * Creates an audio or video resource in the database.
 * @param {httpPair} pair - the pair object
 * @returns {Promise} resolves to an httpPair object
 */
function createAudioOrVideo(pair) {
  return new Promise((resolve, reject) => {
    var dirPath = `public/media/${pair.req.body.type}`
    
    // make sure path exists
    mkdirp(dirPath, err => {
      if (err)
        reject(err)
      
      // write the files to disk
      fs.writeFile(`${dirPath}/${pair.req.body.source.filename}`, pair.req.body.source.data, err => {
        if (err)
          reject(err)
        
        var resource = {
          title: pair.req.body.title,
          description: pair.req.body.description,
          source: `${dirPath}/${pair.req.body.source.filename}`,
          type: pair.req.body.type
        }
      
        pair.db.create('card', resource)
          .then(_ => resolve(pair))
          .catch(err => reject(err))
      })
    })
  })
}

/** @function createGallery
 * Creates a gallery resource in the database.
 * @param {httpPair} pair - the pair object
 * @returns {Promise} resolves to an httpPair object
 */
function createGallery(pair) {
  return new Promise((resolve, reject) => {
    var gallery = {
      title: pair.req.body.title,
      description: pair.req.body.description,
      type: pair.req.body.type
    }
    
    pair.db.create('card', gallery)
      .then(galleryId => createGalleryImages(pair, galleryId))
      .then(_ => resolve(pair))
      .catch(err => reject(err))
  })
}

/** @function createGalleryImages
 * Creates gallery image resources in the database.
 * @param {httpPair} pair - the pair object
 * @param {integer|string} galleryId - the galleryId to use as foreign key
 * @returns {Promise} resolves into an httpPair object
 */
function createGalleryImages(pair, galleryId) {
  return new Promise((resolve, reject) => {
    var dirPath = 'public/media/images'
    
    // create directory if not exists
    mkdirp(dirPath, err => {
      if (err)
        reject(err)
      
      // get an array of image files
      var images = Array.isArray(pair.req.body.source) ? pair.req.body.source : [pair.req.body.source]
      
      // write the files to disk
      var promises = writeImagesToDisk(images, dirPath)
      
      // create gallery image objects
      var galleryImages = images.map(image => {
        return {
          gallery_id: galleryId,
          source: `${dirPath}/${image.filename}`
        }
      })
      
      // save gallery images to database 
      // after they have been written to disk
      Promise.all(promises)
        .then(_ => pair.db.create('gallery_image', galleryImages))
        .then(_ => resolve(pair))
        .catch(err => reject(err))
    })
  })
}

/** @function writeImagesToDisk
 * Writes an array of images to disk.
 * @param {array} images - the images to write to disk
 * @param {string} dirPath - the directory to write to
 * @returns {Promise[]} an array of promises
 */
function writeImagesToDisk(images, dirPath) {
  return images.map(image => {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${dirPath}/${image.filename}`, image.data, err => {
        if (err)
          reject(err)
        
        resolve()
      })
    })
  })
}