const uuid = require('uuid')
const calc = require('../modules/calc')

module.exports = (config, bot) => {
  bot.on('inline_query', (msg) => {
    const rCalc = /^(calc|계산|c) ([\s\S]+)/i
    if (rCalc.test(msg.query)) {
      const text = msg.query.match(rCalc)[2].trim()
      let messageText = `${text}\n\n`

      calc(text).then(result => {
        messageText += `=> ${result}`
        const options = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': result.toString(),
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, options)
      }).catch(err => {
        messageText += err.message
        const options = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': err.message,
          'message_text': err.message,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, options)
      })
    }
  })
}
