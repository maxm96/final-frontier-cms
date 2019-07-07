const sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('data/final_frontier.db')

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
`


/** @module createDatabase
 * Initializes a sqlite database with tables 
 * for article, audio, video, and gallery.
 * @param {createDatabase~callback} cb - callback invoked when done
 */
module.exports = function createDatabase(cb) {
  console.log('Initializing database...')
  
  db.exec(createTables, (err) => {
    if (err)
      return cb(err)
    
    console.log('Initialization complete.')
    db.close()
    cb(null)
  })
}

/** @callback createDatabase~callback
 * @param {string|object} err - any error that occured
 */