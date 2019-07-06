/** @module dataStore
 * Exposes CRUD methods for working with a sqlite database.
 */

const sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('data/final_frontier.db')


/** @function create
 * Creates an entry in the specified table of the database.
 * @param {string} table - the table to insert into
 * @param {object} item - the item to be created
 * @param {create~callback} cb - the callback to invoke when done
 */ 
function create(table, item, cb) {
  if (!table || !item) {
    return cb('Error: missing required arguments for create.')
  }
  
  var columns = Object.keys(item).join()
  var values = Object.values(item).map(i => `'${i}'`).join()
  
  db.run(`INSERT INTO ${table} (${columns}) VALUES (${values})`, cb)
}

/** @callback create~callback
 * Callback invoked by dataStore.create method.
 * @param {string|object} err - any error that occured
 * @param {integer} id - the id assigned to the item  
 */


/** @function read
 * Reads the item from the database.
 * @param {string} table - the table to read from
 * @param {integer|null} id - the id of the item to read, or null if requesting all items
 * @param {read~callback} cb - the callback to invoke when done
 */
function read(table, id, cb) {
  if (!table) {
    return cb('Error: missing required table argument for read.')
  }
  
  var sql = `SELECT * FROM ${table}`
  
  if (id) {
    db.get(`${sql} WHERE id=?`, id, cb)
  } else {
    db.all(sql, cb)
  }
}

/** @callback read~callback
 * Callback invoked by dataStore.read method.
 * @param {string|object} err - any error that occured
 * @param {object} item - the requested item
 */


/** @function update
 * Updates the specified item in the database.
 * @param {string} table - the table of the item
 * @param {integer} id - the id of the item
 * @param {object} updates - the updates to apply
 * @param {update~callback} cb - the callback to invoke when done
 */
function update(table, id, updates, cb) {
  if (!table || !id) {
    return cb('Error: missing required arguments for update.')
  }
  
  delete updates.id // prevent id update
  
  var updateSql = Object.keys(updates).map(k => `${k}=?`).join()
  var sql = `UPDATE ${table} SET ${updateSql} WHERE id=?`
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
 * @param {string} table - the table of the item
 * @param {integer} id - the id of the item
 * @param {destroy~callback} cb - the callback to invoke when done
 */
function destroy(table, id, cb) {
  if (!table || !id) {
    return cb('Error: missing required arguments for destroy.')
  }
  
  db.run(`DELETE FROM ${table} WHERE id=?`, id, cb)
}

/** @callback destroy~callback
 * Callback invoked by the dataStore.destroy method.
 * @param {string|object} err - any error that occured
 * @param {object} item - the removed object
 */


module.exports = {
  create: create,
  read: read,
  update: update,
  destroy: destroy,
}