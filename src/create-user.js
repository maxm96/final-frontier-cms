const bcrypt = require('bcrypt')
const extendTemplate = require('./extend-template')
const ENCRYPTION_PASSES = 10


/** @module createUser
 * Creates a user in the database.
 * @param {httpPair} pair - the pair object
 */
module.exports = function createUser(pair) {
  var user = pair.req.body
  return validateUser(pair, user)
}

function saveUser(pair, user) {
  return new Promise((resolve, reject) => {
    pair.db.saveUser(user)
      .then(_ => resolve(pair))
      .catch(reject)
  })
}

function createPasswordHash(pair, user) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, ENCRYPTION_PASSES, (err, hash) => {
      if (err)
        reject(err)

      user.password = hash
      saveUser(pair, user)
        .then(resolve)
        .catch(reject)
    })
  })
}

function validateUser(pair, user) {
  return new Promise((resolve, reject) => {
    if (typeof user.username !== 'string' || user.username.length < 3)
      reject('Username must be at least 3 characters in length')
    if (typeof user.password !== 'string' || user.password.length < 10)
      reject('Password must be at least ten characters in length')
    if (user.password !== user.passwordConfirmation)
      reject('Password and Password Confirmation do not match')
    
    pair.db.getUser(user.username)
      .then(fetchedUser => {
        if (fetchedUser)
          reject('That username is already taken. Did you mean to <a href="/signin">sign in</a>?')

        createPasswordHash(pair, user)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}