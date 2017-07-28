const request = require('request-promise-native')

module.exports = (expr) => {
  return new Promise((resolve, reject) => {
    // Precision 8
    const url = 'http://api.mathjs.org/v1/?precision=8&expr=' + encodeURIComponent(expr)

    request(url).then(result => {
      resolve(Number(result))
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

if (require.main === module) {
  require('./calculator')('5.08 cm to inch').then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })
}
