const speech = require('../speech')

const euclid = (a, b) => {
  for (let i = 0; i <= 1000000; i++) {
    if (i === 1000000) {
      return Infinity
    }

    if (a === b) {
      break
    } else if (a > b) {
      a -= b
    } else if (a < b) {
      b -= a
    }
  }

  return a
}

const ratio = (query) => {
  return new Promise((resolve, reject) => {
    let arr = []

    if ((query.split(/:/) || []).length === 2) {
      arr = query.split(/:/)
    } else if ((query.split(/x/) || []).length === 2) {
      arr = query.split(/x/)
    } else if ((query.split(/ /) || []).length === 2) {
      arr = query.split(/ /)
    }

    arr[0] = !isNaN(arr[0]) ? parseFloat(arr[0]) : reject(new Error(speech.ratio.error))
    arr[1] = !isNaN(arr[1]) ? parseFloat(arr[1]) : reject(new Error(speech.ratio.error))

    const result = euclid(arr[0], arr[1])

    if (result === Infinity) {
      reject(new Error(speech.ratio.errorLimit))
    }

    resolve(parseInt(Math.round(arr[0] / result)) + ' : ' + parseInt(Math.round(arr[1] / result)))
  })
}

module.exports = ratio

if (require.main === module) {
  require('./ratio')('1920 1080').then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err.message)
  })
}
