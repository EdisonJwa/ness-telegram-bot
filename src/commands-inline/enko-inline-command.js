/**
 * @file enko-inline-command.js
 * @author Nesffer <nesffer.jimin@gmail.com>
 */

const uuid = require('uuid')
const gksdud = require('gksdud')
const config = require('../config')
const logger = require('../lib/logger')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const regex = /^\/(e|enko|dudgks|영한)\s+([\s\S]+)/i
    if (regex.test(msg.query)) {
      const text = msg.query.match(regex)[2].trim()
      const hangul = gksdud(text)

      const title = hangul
      const messageText = hangul
      const result = [{
        'type': 'article',
        'id': uuid.v4(),
        'title': title,
        'message_text': messageText
      }]

      try {
        bot.answerInlineQuery(msg.id, result, option)
      } catch (err) {
        logger.error(err.message)
      }
    }
  })
}
