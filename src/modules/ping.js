const ping = require('ping')
const speech = require('../speech')

/**
 * Ping the server.
 * @param {string} host IP or Domain
 * @param {number} [num=1] Ping count
 * @returns {Promise<object, object>} Object or Error
 */
const getPing = (host, num = 1) => {
  return new Promise((resolve, reject) => {
    if (/^(\d{1,3}\.){3}(\d{1,3})$/.test(host) || /^[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(host)) {
      const count = !isNaN(num) ? parseInt(num) : 1
      const options = {
        timeout: 10,
        extra: ['-c ' + count]
      }
      ping.promise.probe(host, options).then(result => {
        resolve(result)
      }).catch(err => {
        reject(new Error(err.message))
      })
    } else {
      reject(new Error(speech.ping.error))
    }
  })
}

module.exports = getPing

if (require.main === module) {
  require('./ping')('google.com', 3).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err.message)
  })
}
