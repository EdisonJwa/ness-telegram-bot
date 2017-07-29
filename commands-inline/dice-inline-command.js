const uuid = require('uuid')
const dice = require('../modules/dice')

const thanConvert = (str) => str.replace('<', '&lt;').replace('>', '&gt;')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rChance = /^(dice|주사위|확률) ([\s\S]+)/i
    if (rChance.test(msg.query)) {
      const text = msg.query.match(rChance)[2].trim()
      const title = `"${text}" Dice 🎲`
      let messageText = '🎲 <strong>Dice</strong> 🎲\n\n'

      dice(text).then(tables => {
        (() => {
          return new Promise((resolve, reject) => {
            for (const item of tables) {
              messageText += `${thanConvert(item.item)}\n<code>${item.progress}</code> <strong>${item.num}%</strong>\n`
            }

            resolve(messageText)
          })
        })().then(messageText => {
          const result = [{
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': messageText,
            'parse_mode': 'html'
          }]

          bot.answerInlineQuery(msg.id, result, option)
        })
      }).catch(err => {
        messageText += err.message
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
