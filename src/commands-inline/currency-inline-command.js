const uuid = require('uuid')
const currency = require('../modules/currency')
const config = require('../config')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const rDday = /^(currency|환율)/i
    if (rDday.test(msg.query)) {
      currency().then(res => {
        const title = '환율'
        const messageText = res
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, result, option).catch(() => {
          // Nothing
        })
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

        bot.answerInlineQuery(msg.id, result, option).catch(() => {
          // Nothing
        })
      })
    }
  })
}
