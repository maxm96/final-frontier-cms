/** @module dataStore
 * Exposes CRUD methods for working with a sqlite database.
 */

const sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('data/final_frontier.db')


/** @function create
 * Creates an entry in the specified table of the database.
 * @param {object} item - the item to be created
 * @param {create~callback} cb - the callback to invoke when done
 */ 
function create(item, cb) {
  if (!item) {
    return cb('Error: missing required argument for create.')
  }
  
  var columns = Object.keys(item).join()
  var values = Object.values(item).map(i => `'${i}'`).join()
  
  db.run(`INSERT INTO card (${columns}) VALUES (${values})`, cb)
}

/** @callback create~callback
 * Callback invoked by dataStore.create method.
 * @param {string|object} err - any error that occured
 * @param {integer} id - the id assigned to the item  
 */


/** @function read
 * Reads the item from the database.
 * @param {integer|null} id - the id of the item to read
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
  db.all('SELECT * FROM card', cb)
}

/** @callback readAll~callback
 * Callback invoked by dataStore.readAll method.
 * @param {string|object} err - any error that occured
 * @param {array} items - the retrieved items
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
  read: read,
  readAll: readAll,
  update: update,
  destroy: destroy,
}