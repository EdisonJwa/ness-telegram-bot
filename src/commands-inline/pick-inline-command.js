const uuid = require('uuid')
const pick = require('../modules/pick')

const thanConvert = (str) => str.replace('<', '&lt;').replace('>', '&gt;')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rPick = /^(pick|골라|선택) ([\s\S]+)/i
    if (rPick.test(msg.query)) {
      const text = msg.query.match(rPick)[2].trim()

      const title = `"${text}" 중에서 선택`
      const messageText = `<code>"${thanConvert(text)}"</code> 중에서 선택\n\n=> <strong>${thanConvert(pick(text))}</strong>`
      const result = [{
        'type': 'article',
        'id': uuid.v4(),
        'title': title,
        'message_text': messageText,
        'parse_mode': 'html'
      }]

      bot.answerInlineQuery(msg.id, result, option)
    }
  })
}
