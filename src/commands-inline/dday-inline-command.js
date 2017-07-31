const uuid = require('uuid')
const dday = require('../modules/dday')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rDday = /^(dday|디데이|d) ([\s\S]+)/i
    if (rDday.test(msg.query)) {
      const text = msg.query.match(rDday)[2].trim()

      dday(text).then(res => {
        const title = res
        const messageText = `${text} <strong>D-Day</strong>\n\n${res}`
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
