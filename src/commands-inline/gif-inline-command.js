/**
 * @file gif-inline-command.js
 * @author Nesffer <nesffer.jimin@gmail.com>
 */

const uuid = require('uuid')
const googleImage = require('../modules/google-image')
const _ = require('underscore')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

const button = { url: '🌏', inline: '🔍' }

module.exports = (bot) => {
  bot.on('inline_query', async (msg) => {
    locale.locale = msg.from.language_code
    const rGoogleGif = /^\/(gif|ㅇㅉ|움짤)\s+([\s\S]+)/i
    if (rGoogleGif.test(msg.query)) {
      const text = msg.query.match(rGoogleGif)[2].trim()

      try {
        const results = await googleImage.gif(text)

        const images = _.shuffle(results)
        const result = []
        for (const item of images) {
          result.push({
            'type': 'gif',
            'id': uuid.v4(),
            'gif_url': item.ou,
            'thumb_url': item.tu,
            'reply_markup': {
              inline_keyboard: [[
                { text: button.url, url: item.ru },
                { text: button.inline, switch_inline_query_current_chat: `/gif ${text}` }
              ]]
            }
          })
        }

        bot.answerInlineQuery(msg.id, result)
      } catch (err) {
        logger.error(err.message)
        const title = locale.__('image.error')
        const messageText = locale.__('image.error')
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText
        }]

        bot.answerInlineQuery(msg.id, result)
      }
    }
  })
}
