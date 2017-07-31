const _ = require('underscore')
const random = require('random-js')()
const speech = require('../speech')

const dice = (text) => {
  return new Promise((resolve, reject) => {
    let arr
    if ((text.match(/[,\s\n]/) || []).length === 0) {
      arr = [text]
    } else if ((text.match(/\n/g) || []).length > 0) {
      arr = text.split(/\n/g).map(x => x.trim())
    } else if ((text.match(/,/g) || []).length > 0) {
      arr = text.split(/,/g).map(x => x.trim())
    } else if ((text.match(/\s/g) || []).length > 0) {
      arr = text.split(/\s/g).map(x => x.trim())
    }

    // Remove duplication
    arr = _.uniq(arr)

    // Create table
    let table = []
    for (const item of arr) {
      const num = random.integer(1, 100)
      const progress = `[${'='.repeat(parseInt(num / 10))}>${' '.repeat(10 - parseInt(num / 10))}]`
      table.push({ item, num, progress })
    }

    // Sort desc
    table = table.sort((item1, item2) => {
      return item2.num - item1.num
    })

    if (table.length > 0) {
      resolve(table)
    } else {
      reject(new Error(speech.error))
    }
  })
}

module.exports = dice

if (require.main === module) {
  require('./dice')('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z').then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })
}
