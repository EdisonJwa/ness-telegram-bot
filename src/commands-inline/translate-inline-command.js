const uuid = require('uuid')
const translate = require('../modules/google-translate')
const config = require('../config')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const rTranslate = /^(translate|translation|tr|번역)\s+([\s\S]+)/i
    if (rTranslate.test(msg.query)) {
      const text = msg.query.match(rTranslate)[2].trim()

      translate(text).then(res => {
        const title = '번역: ' + res
        const messageText = res
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, result, option)
      }).catch(err => {
        const title = err.message
        const messageText = err.message
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, result, option)
      })
    }
  })
}
