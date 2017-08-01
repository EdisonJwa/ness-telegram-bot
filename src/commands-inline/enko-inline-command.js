const uuid = require('uuid')
const gksdud = require('gksdud')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const regex = /^(enko|dudgks|영한|e) ([\s\S]+)/i
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

      bot.answerInlineQuery(msg.id, result, option)
    }
  })
}
