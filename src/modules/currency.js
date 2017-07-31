const request = require('request-promise-native')
const speech = require('../speech')

const getCurrency = (base = 'KRW') => {
  return new Promise((resolve, reject) => {
    if (!/^[a-zA-Z]{3}$/.test(base.trim())) {
      reject(new Error(speech.currency.errorUnit))
    }

    const options = {
      url: 'http://api.fixer.io/latest?base=' + base.toUpperCase(),
      json: true
    }

    request(options).then(json => {
      resolve(json)
    }).catch(err => {
      if (err.statusCode === 422) {
        reject(new Error(speech.currency.errorUnit))
      } else {
        reject(new Error(err.message))
      }
    })
  })
}

const currency = (base = 'USD', multiple = 1) => {
  return new Promise((resolve, reject) => {
    if (!isFinite(parseFloat(multiple))) reject(new Error(speech.currency.errorMultiple))

    const favorites = ['USD', 'JPY', 'EUR', 'CNY', 'CAD', 'AUD', 'GBP', 'KRW']
    const output = []

    const formatCurrency = (json) => {
      return new Promise(async (resolve, reject) => {
        const output = []

        for (const item in json.rates) {
          if (favorites.includes(item)) {
            await output.push('<code>' + item + '</code>: ' + (json.rates[item] * multiple).toFixed(3))
          }
        }

        if (output.length > 0) {
          resolve(output)
        } else {
          reject(new Error('Error!'))
        }
      })
    }

    getCurrency(base).then(async (json) => {
      await output.push('날짜: <strong>' + json.date + '</strong>')
      await output.push('기준: <strong>' + json.base + ' * ' + multiple + '</strong>\n')
      formatCurrency(json).then(formatted => {
        resolve(output.concat(formatted).join('\n'))
      }).catch(err => {
        reject(err.message)
      })
    }).catch(err => {
      reject(err.message)
    })
  })
}

module.exports = currency

if (require.main === module) {
  const currency = require('./currency')
  currency('USD').then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err.message)
  })
}
