const request = require('request-promise-native')
const math = require('mathjs')
const speech = require('../speech')

/**
 * Scientific Notation convert to Number. This is reversal of toExponential()
 * @param {Number} num
 * @returns {String}
 */
const noExponents = (num) => {
  const data = String(num).split(/[eE]/)
  if (data.length === 1) return data[0]

  let z = ''
  const sign = num < 0 ? '-' : ''
  const str = data[0].replace('.', '')
  let mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + '0.'
    while (mag++) z += '0'
    return z + str.replace(/^\-/, '')
  }
  mag -= str.length
  while (mag--) z += '0'

  return str + z
}

/**
 * If you pass the expr, return the calculated number
 * @param {String} expr
 * @returns {Promise<String, Object>}
 */
const http = (expr) => {
  return new Promise((resolve, reject) => {
    const url = 'http://api.mathjs.org/v1/?expr=' + encodeURIComponent(expr)

    request(url).then(num => {
      resolve(noExponents(num))
    }).catch(() => {
      reject(new Error(speech.calc.error))
    })
  })
}

/**
 * If you pass the expr, return the calculated number
 * @param {String} expr
 * @returns {Promise<String, Object>}
 */
const calc = (expr) => {
  return new Promise((resolve, reject) => {
    http(expr).then(result => {
      resolve(noExponents(result))
    }).catch(() => {
      math.config({
        number: 'BigNumber',
        precision: 64
      })

      const result = math.eval(expr)

      if (!isNaN(result)) {
        resolve(noExponents(result))
      } else {
        reject(new Error(speech.calc.error))
      }
    })
  })
}

module.exports = calc

if (require.main === module) {
  calc('2^100').then(num => {
    console.log(num)
  }).catch(err => {
    console.error(err.message)
  })
}
