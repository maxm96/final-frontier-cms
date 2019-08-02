const sqlite3 = require('sqlite3').verbose()
const mkdirp = require('mkdirp')

const createTables = `
CREATE TABLE IF NOT EXISTS card (
  id INTEGER PRIMARY KEY,
  title TEXT,
  body TEXT,
  description TEXT,
  source TEXT,
  type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery_image (
  id INTEGER PRIMARY KEY,
  gallery_id INTEGER,
  source TEXT,
  FOREIGN KEY (gallery_id) REFERENCES card (id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(75),
  password VARCHAR(75)
);
`


/** @module DataStore
 * Instantiates a sqlite database and exposes 
 * queries to interact with the database.
 */
module.exports = class DataStore {
  /** @constructor
   * Creates an instance of DataStore.
   */
  constructor() {
    // make sure data directory exists
    mkdirp.sync('data')
    
    this.db = new sqlite3.Database('data/final_frontier.db')
    this.db.exec(createTables, err => {
      if (err)
        console.error(err)
      
      this.create = this.create.bind(this)
      this.read = this.read.bind(this)
      this.readAll = this.readAll.bind(this)
      this.readGalleryImages = this.readGalleryImages.bind(this)
      this.update = this.update.bind(this)
      this.destroy = this.destroy.bind(this)
    })
  }
  
  /** @function create
   * Inserts the given item into the specified table.
   * @param {string} table - the table to insert the item into
   * @param {object|array} item - an object or array of objects of properties to insert into the database
   * @returns {Promise} resolves to the id of the inserted item
   */
  create(table, item) {
    return new Promise((resolve, reject) => {
      if (!table || typeof table !== 'string')
        reject(new TypeError('The table must be a non-empty string'))
      if (!item || typeof item !== 'object')
        reject(new TypeError('The item must be a valid object or array of objects'))
      
      var columns = ''
      var values = ''
      
      if (Array.isArray(item)) {
        columns = Object.keys(item[0]).join()
        // map over items array to create values string
        values = item
          .map(i => Object.values(i).map(v => `'${v}'`).join())
          .map(vStr => `(${vStr})`).join()
      } else {
        columns = Object.keys(item).join()
        values = '(' + Object.values(item).map(i => `'${i}'`).join() + ')'
      }
      
      this.db.run(`INSERT INTO ${table} (${columns}) VALUES ${values}`, function (err) {
        if (err)
          reject(err)
        
        resolve(this.lastID)
      })
    })
  }
  
  /** @function read
   * Reads a single entry specified by the given id and table.
   * @param {string} table - the table to read the item from
   * @param {number|string} id - the id to look for
   * @returns {Promise} resolves to an item from the database
   */
  read(table, id) {
    return new Promise((resolve, reject) => {
      if (!table || typeof table !== 'string')
        reject(new TypeError('The table must be a non-empty string'))
      if (!id || (typeof id !== 'number' && typeof id !== 'string'))
        reject(new TypeError('The given id is invalid'))
      
      this.db.get(`SELECT * FROM ${table} WHERE id=?`, id, function (err, row) {
        if (err)
          reject(err)
        
        resolve(row)
      })
    })
  }
  
  /** @function readAll
   * Reads all entries from the specified table.
   * @param {string} table - the table to read from
   * @returns {Promise} resolves to the read entries
   */
  readAll(table) {
    return new Promise((resolve, reject) => {
      if (!table || typeof table !== 'string')
        reject(new TypeError('The table must be a non-empty string'))
      
      this.db.all(`SELECT * FROM ${table}`, function (err, rows) {
        if (err)
          reject(err)
        
        resolve(rows)
      })
    })
  }
  
  /** @function readGalleryImages
   * Reads gallery images that match the provided parent id.
   * @param {number|string} galleryId - the gallery id
   * @returns {Promise} resolves to the read gallery images
   */
  readGalleryImages(galleryId) {
    return new Promise((resolve, reject) => {
      if (!galleryId || (typeof galleryId !== 'number' && typeof galleryId !== 'string'))
        reject(new TypeError(`Invalid galleryId ${galleryId}`))
      
      this.db.all(`SELECT * FROM gallery_image WHERE gallery_id=?`, galleryId, function (err, rows) {
        if (err)
          reject(err)
        
        resolve(rows)
      })
    })
  }
  
  /** @function update
   * Updates the specified resource.
   * @param {string} table - the table of the resource
   * @param {number|string} - the id of the resource
   * @param {object} updates - the updates to be applied
   * @returns {Promise} resolves to the id of the updated resource
   */
  update(table, id, updates) {
    return new Promise((resolve, reject) => {
      if (!table || typeof table !== 'string')
        reject(new TypeError('The table must be a non-empty string'))
      if (!id || (typeof id !== 'number' && typeof id !== 'string'))
        reject(new TypeError('The given id is invalid'))
      if (!updates || typeof updates !== 'object')
        reject(new TypeError('Updates must be supplied as an object'))
      
      // don't want to change the resources id
      delete updates.id
      
      var sql = `UPDATE ${table} SET ${Object.keys(updates).map(k => `${k}=?`).join()} WHERE id=?`
      var updateValues = Object.values(updates)
      updateValues.push(id)
      
      this.db.run(sql, updateValues, function (err) {
        if (err)
          reject(err)
        
        resolve(id)
      })
    })
  }
  
  /** @function destroy
   * Removes the specified resource from the database.
   * @param {string} table - the table the resource is stored in
   * @param {number|string} id - the id of the resource
   * @returns {Promise} resolves to the id of the deleted resource
   */
  destroy(table, id) {
    return new Promise((resolve, reject) => {
      if (!table || typeof table !== 'string')
        reject(new TypeError('The table must be a non-empty string'))
      if (!id || (typeof id !== 'number' && typeof id !== 'string'))
        reject(new TypeError('The given id is invalid'))
      
      this.db.run(`DELETE FROM ${table} WHERE id=?`, id, function (err) {
        if (err)
          reject(err)
        
        resolve(id)
      })
    })
  }
}