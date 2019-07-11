/** @module dataStore
 * Exposes CRUD methods for working with a sqlite database.
 */

const sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('data/final_frontier.db')


/** @function create
 * Creates an entry in the card table of the database.
 * @param {object} item - the item to be created
 * @param {create~callback} cb - the callback to invoke when done
 */ 
function create(item, cb) {
  if (!item)
    return cb('Error: missing required argument for create.')
  
  var columns = Object.keys(item).join()
  var values = Object.values(item).map(i => `'${i}'`).join()
  
  db.run(`INSERT INTO card (${columns}) VALUES (${values})`, function (err) {
    if (err)
      return cb(err)
    
    cb(null, this.lastID)
  })
}

/** @callback create~callback
 * Callback invoked by dataStore.create method.
 * @param {string|object} err - any error that occured
 * @param {integer} id - the id assigned to the item  
 */


/** @function createGalleryImages
 * Inserts an entry to the gallery_image table.
 * @param {array} images - an array of image objects to insert
 * @param {createGalleryImages~callback} cb - the callback to invoke when done
 */
function createGalleryImages(images, cb) {
  if (!images)
    return cb('Error: missing required argument to create gallery images.')
  
  var columns = Object.keys(images[0]).join()
  var values = images.map(image => Object.values(image).map(i => `'${i}'`).join())
  
  db.run(`INSERT INTO gallery_image (${columns}) VALUES ${values.map(v => `(${v})`).join()}`, cb)
}

/** @callback createGalleryImages~callback
 * Callback invoked by dataStore.createGalleryImages method.
 * @param {string|object} err - any error that occured
 */


/** @function read
 * Reads the item from the database.
 * @param {integer} id - the id of the item to read
 * @param {read~callback} cb - the callback to invoke when done
 */
function read(id, cb) {
  if (!id) {
    return cb('Error: missing required argument for read.')
  }
  
  db.get(`SELECT * FROM card WHERE id=?`, id, cb)
}

/** @callback read~callback
 * Callback invoked by dataStore.read method.
 * @param {string|object} err - any error that occured
 * @param {object} item - the requested item
 */


/** @function readAll
 * Retrieve each entry from each table in the database.
 * @param {readAll~callback} cb - the callback to invoke when done
 */
function readAll(cb) {
  db.all('SELECT * FROM card', (err, items) => {
    if (err)
      return cb(err)
    
    // instantiate variable to modify
    var completeItems = [...items]
    
    // get images for gallery
    var promises = items.map((item, index) => {
      if (item.type === 'gallery') {
        return new Promise((resolve, reject) => {
          readGalleryImages(item.id, (err, images) => {
            if (err)
              return reject(err)
            
            completeItems[index]['images'] = images.map(image => image.source)
            resolve()
          })
        })
      }
    })
    
    Promise.all(promises).then(_ => cb(null, completeItems))
  })
}

/** @callback readAll~callback
 * Callback invoked by dataStore.readAll method.
 * @param {string|object} err - any error that occured
 * @param {array} items - the retrieved items
 */


/** @function readGalleryImages
 * Retrieves gallery images for a given gallery.
 * @param {integer} galleryId - the gallery id
 * @param {readGalleryImage~callback} cb - the callback to invoke when done
 */
function readGalleryImages(galleryId, cb) {
  db.all('SELECT * FROM gallery_image WHERE gallery_id=?', galleryId, cb)
}

/** @callback readGalleryImages~callback
 * Callback invoked by the dataStore.readGalleryImages method.
 * @param {string|object} err - any error that occurred
 * @param {array} items - the retrieved gallery images
 */


/** @function update
 * Updates the specified item in the database.
 * @param {integer} id - the id of the item
 * @param {object} updates - the updates to apply
 * @param {update~callback} cb - the callback to invoke when done
 */
function update(id, updates, cb) {
  if (!id) {
    return cb('Error: missing required argument for update.')
  }
  
  delete updates.id // prevent id update
  
  var updateSql = Object.keys(updates).map(k => `${k}=?`).join()
  var sql = `UPDATE card SET ${updateSql} WHERE id=?`
  var updateValues = Object.values(updates)
  updateValues.push(id)
  
  db.run(sql, updateValues, cb)
}

/** @callback update~callback
 * Callback invoked by dataStore.update method.
 * @param {string|object} err - any error that occured
 * @param {object} item [optional] - the updated item
 */


/** @function destroy
 * Removes the specified item from the database.
 * @param {integer} id - the id of the item
 * @param {destroy~callback} cb - the callback to invoke when done
 */
function destroy(id, cb) {
  if (!id) {
    return cb('Error: missing required argument for destroy.')
  }
  
  db.run(`DELETE FROM card WHERE id=?`, id, cb)
}

/** @callback destroy~callback
 * Callback invoked by the dataStore.destroy method.
 * @param {string|object} err - any error that occured
 * @param {object} item - the removed object
 */


module.exports = {
  create: create,
  createGalleryImages: createGalleryImages,
  read: read,
  readAll: readAll,
  readGalleryImages: readGalleryImages,
  update: update,
  destroy: destroy,
}