const calc = require('../modules/calc')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(calc|계산|c)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.calc.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id

      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const expr = message.text
        const option = { reply_to_message_id: messageId }

        calc(expr).then(result => {
          bot.sendMessage(chatId, result, option).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(calc|계산|c)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const expr = match[3]

    calc(expr).then(result => {
      bot.sendMessage(chatId, result, option).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Equal Command
  const rEqual = new RegExp('^=(\\S+[\\s\\S]*)', 'i')
  bot.onText(rEqual, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const expr = match[1]
    const ko = match[1].match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) ? match[1].match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g).length : 0

    if (ko === 0) {
      calc(expr).then(result => {
        bot.sendMessage(chatId, result, option).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    }
  })
}
