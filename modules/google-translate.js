const translate = require('node-google-translate-skidz')
const speech = require('../speech')

const googleTranslate = (query) => {
  return new Promise((resolve, reject) => {
    const ko = query.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) ? query.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g).length : 0
    const en = query.match(/[a-zA-Z]/g) ? query.match(/[a-zA-Z]/g).length : 0
    const ja = query.match(/[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/g) ? query.match(/[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/g).length : 0

    let options = { text: query, source: 'en', target: 'ko' }
    if (ko > en + ja) {
      options = { text: query, source: 'ko', target: 'en' }
    } else if (en > ja || ja > en) {
      options = { text: query, source: en > ja ? 'en' : 'ja', target: 'ko' }
    }

    translate(options, (result) => {
      if (result.translation) {
        resolve(result.translation)
      } else {
        reject(new Error(speech.translate.error))
      }
    })
  })
}

module.exports = googleTranslate

if (require.main === module) {
  require('./google-translate')('Hello World!').then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err.message)
  })
}
