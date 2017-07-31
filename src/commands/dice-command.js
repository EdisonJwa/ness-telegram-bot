const dice = require('../modules/dice')
const speech = require('../speech')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const chanceRegex = new RegExp('^/(dice|주사위|확률)(@' + BOTNAME + ')?$', 'i')
  bot.onText(chanceRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.dice.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const option = { reply_to_message_id: messageId }
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        dice(text).then(table => {
          (() => {
            let output = '🎲 <strong>Dice</strong> 🎲\n\n'

            return new Promise((resolve, reject) => {
              for (const item of table) {
                output += `${thanConvert(item.item)}\n<code>${item.progress}</code> <strong>${item.num}%</strong>\n`
              }

              resolve(output)
            })
          })().then(result => {
            bot.sendMessage(chatId, result, options).catch(() => {
              bot.sendMessage(chatId, speech.error, option)
            })
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      })
    })
  })

  // Query Command
  const chanceArgRegex = new RegExp('^/(dice|주사위|확률)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(chanceArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    dice(text).then(table => {
      (() => {
        return new Promise((resolve, reject) => {
          let output = '🎲 <strong>Dice</strong> 🎲\n\n'

          for (const item of table) {
            output += `${thanConvert(item.item)}\n<code>${item.progress}</code> <strong>${item.num}%</strong>\n`
          }

          resolve(output)
        })
      })().then(result => {
        bot.sendMessage(chatId, result, options).catch(() => {
          bot.sendMessage(chatId, speech.error, option)
        })
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
