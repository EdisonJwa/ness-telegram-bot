const uuid = require('uuid')
const ratio = require('../modules/ratio')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rRatio = /^(ratio|비율) ([\s\S]+)/i
    if (rRatio.test(msg.query)) {
      const text = msg.query.match(rRatio)[2].trim()

      ratio(text).then(res => {
        const title = res
        const messageText = `<strong>${text}</strong> 비율\n\n=> ${res}`
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
