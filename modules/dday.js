const speech = require('../speech')

module.exports = (query) => {
  return new Promise((resolve, reject) => {
    let yyyy = ''
    let mm = ''
    let dd = ''

    if (query.split(',').length === 3) {
      yyyy = parseInt(query.split(',')[0])
      mm = parseInt(query.split(',')[1]) - 1
      dd = parseInt(query.split(',')[2])
    } else if (query.split('.').length === 3) {
      yyyy = parseInt(query.split('.')[0])
      mm = parseInt(query.split('.')[1]) - 1
      dd = parseInt(query.split('.')[2])
    } else if (query.split('-').length === 3) {
      yyyy = parseInt(query.split('-')[0])
      mm = parseInt(query.split('-')[1]) - 1
      dd = parseInt(query.split('-')[2])
    } else if (query.split(' ').length === 3) {
      yyyy = parseInt(query.split(' ')[0])
      mm = parseInt(query.split(' ')[1]) - 1
      dd = parseInt(query.split(' ')[2])
    } else {
      reject(new Error(speech.dday.error))
    }

    // Input date
    const inputDate = new Date(yyyy, mm, dd)
    // Current date
    const nowDate = new Date()
    // Time diff
    const timeDiff = inputDate.getTime() - nowDate.getTime()
    // Day diff
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    let output = ''

    if (diffDays === 0) {
      output = speech.dday.today
    } else if (diffDays < 0) {
      output = Math.abs(diffDays) + speech.dday.past
    } else if (diffDays > 0) {
      output = diffDays + speech.dday.future
    }

    resolve(output)
  })
}
