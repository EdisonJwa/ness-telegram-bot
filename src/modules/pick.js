const speech = require('../speech')

const choice = (items) => {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

const pick = (query) => {
  if (Array.isArray(query)) {
    return choice(query).trim()
  } else {
    if ((query.match(/,/g) || []).length >= 1) {
      return choice(query.split(/,/g)).trim()
    } else if ((query.split(/ /g) || []).length >= 2) {
      return choice(query.split(/ /g)).trim()
    } else if ((query.split(/\n/g) || []).length >= 2) {
      return choice(query.split(/\n/g)).trim()
    } else {
      return speech.pick.error
    }
  }
}

module.exports = pick

if (require.main === module) {
  const result = require('./pick')('A B C')
  console.log(result)
}
