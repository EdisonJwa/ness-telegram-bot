const uuid = require('uuid')
const ping = require('../modules/ping')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME

  const getHTML = (result) => {
    const output = `<code>Host :</code> ${result.numeric_host}
<code>Alive:</code> ${result.alive}
<code>Time :</code> ${!isNaN(parseFloat(result.time)) ? parseFloat(result.time).toString() + 'ms' : 'None'}`
    return output
  }

  bot.on('inline_query', (msg) => {
    const rPing = /^(ping|핑) ([\s\S]+)/i
    if (rPing.test(msg.query)) {
      const text = msg.query.match(rPing)[2].trim()
      const title = text !== '' ? text + ' Ping' : 'Ping'
      let messageText = ''
      ping(text).then(result => {
        messageText += getHTML(result)

        const options = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, options, { cache_time: CACHETIME }).catch(err => {
          bot.answerInlineQuery(msg.id, err.message, { cache_time: CACHETIME })
        })
      }).catch(err => {
        messageText += err.message

        const options = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText,
          'parse_mode': 'html'
        }]

        bot.answerInlineQuery(msg.id, options, { cache_time: CACHETIME }).catch(err => {
          bot.answerInlineQuery(msg.id, err.message, { cache_time: CACHETIME })
        })
      })
    }
  })
}
