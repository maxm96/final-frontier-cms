const bcrypt = require('bcrypt')
const extendTemplate = require('./extend-template')


/** @module createAuthSession
 * Validates a username/password combination.
 * @param {httpPair} pair - the pair object
 */
module.exports = function createAuthSession(pair) {
  return retrieveUser(pair)
}

/** @function retrieveUser
 * Attempts to retrieve a username from the database.
 * @param {httpPair} pair - the pair object
 */
function retrieveUser(pair) {
  return new Promise((resolve, reject) => {
    pair.db.getUser(pair.req.body.username)
      .then(user => {
        if (!user)
          reject('Username/password combination not found. Please try again.')
        
        validatePassword(pair, user)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}

/** @function validatePassword
 * Validates a password for a given user.
 * @param {httpPair} pair - the pair object
 * @param {object} user - the user object
 */
function validatePassword(pair, user) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pair.req.body.password, user.password, (err, result) => {
      if (result) {
        pair.session.user = user
        resolve(pair)
      }
      else
        reject('Username/password combination not found. Please try again.')
    })
  })
}