const uuid = require('uuid')
const google = require('../modules/google-search')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const rGoogle = /^(google|구글|g|gg) ([\s\S]+)/i
    if (rGoogle.test(msg.query)) {
      const text = msg.query.match(rGoogle)[2].trim()
      const simple = msg.query.match(rGoogle)[1].trim() === 'gg'  // if gg, no description
      const count = !simple ? 3 : 5  // if gg, count 5 else 3
      const title = `"${text}" 검색 결과`
      let messageText = `<strong>"${thanConvert(text)}"</strong> 검색 결과\n\n`

      google.html(text, '', simple).then(results => {
        const output = []

        for (const result of results) {
          if (output.length < count) {
            output.push(Object.values(result).join('\n'))
          }
        }

        messageText += output.join('\n\n')
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html',
          'disable_web_page_preview': true
        }]

        bot.answerInlineQuery(msg.id, result)
      }).catch(err => {
        messageText += err.message
        const result = [
          {
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': messageText,
            'parse_mode': 'html',
            'disable_web_page_preview': true
          }
        ]

        bot.answerInlineQuery(msg.id, result)
      })
    }
  })
}
