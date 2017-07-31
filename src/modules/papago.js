const request = require('request-promise-native')
const config = require('../config')
const speech = require('../speech')

/**
 * If you pass the query, return the translatedText
 * {@link https://developers.naver.com/docs/nmt/reference|NAVER Developers}
 * @param {String} query Original Text
 * @returns {Promise<String, Object>} translatedText or Error
 */
const papago = (query) => {
  return new Promise((resolve, reject) => {
    const ko = query.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) ? query.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g).length : 0
    const en = query.match(/[a-zA-Z]/g) ? query.match(/[a-zA-Z]/g).length : 0
    const ja = query.match(/[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/g) ? query.match(/[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/g).length : 0

    let options = {
      method: 'POST',
      url: 'https://openapi.naver.com/v1/papago/n2mt',
      form: { 'source': 'en', 'target': 'ko', 'text': query },
      headers: { 'X-Naver-Client-Id': config.NAVER_API_KEY_ID, 'X-Naver-Client-Secret': config.NAVER_API_KEY_SECRET },
      json: true
    }
    if (ko > en + ja) {
      options['form'] = { 'source': 'ko', 'target': 'en', 'text': query }
    } else if (en > ja || ja > en) {
      options['form'] = { 'source': en > ja ? 'en' : 'ja', 'target': 'ko', 'text': query }
    }

    request(options).then(json => {
      if (Object.keys(json).length > 0) {
        resolve(json.message.result.translatedText)
      } else {
        reject(new Error(speech.papago.error))
      }
    }).catch(() => {
      reject(new Error(speech.papago.error))
    })
  })
}

module.exports = papago

if (require.main === module) {
  require('./papago')('Hello World!').then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err.message)
  })
}
