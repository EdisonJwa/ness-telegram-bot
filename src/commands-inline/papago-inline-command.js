const uuid = require('uuid')
const papago = require('../modules/papago')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rPapago = /^(papago|파파고|p) ([\s\S]+)/i
    if (rPapago.test(msg.query)) {
      const text = msg.query.match(rPapago)[2].trim()
      papago(text).then(translatedText => {
        const title = translatedText
        const messageText = translatedText
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
