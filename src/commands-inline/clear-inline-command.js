const uuid = require('uuid')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    locale.locale = msg.from.language_code
    const rClear = /^\/(clear|cls|ㅊㅅ|청소)$/i
    if (rClear.test(msg.query)) {
      const output = []

      output.push(locale.__('clear.clearing'))
      for (let i = 0; i < 45; i++) {
        output.push('\n')
      }
      output.push(locale.__('clear.cleared'))

      const title = locale.__('clear.title')
      const messageText = output.join('\n')
      const result = [{
        'type': 'article',
        'id': uuid.v4(),
        'title': title,
        'message_text': messageText
      }]

      try {
        bot.answerInlineQuery(msg.id, result)
      } catch (err) {
        logger.error(err.message)
      }
    }
  })
}
