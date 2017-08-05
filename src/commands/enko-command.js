const gksdud = require('gksdud')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(enko|dudgks|영한|e)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    if (reply) {
      if (reply.text) {
        const text = reply.text
        const hangul = gksdud(text)

        bot.sendMessage(chatId, hangul, option)
      } else {
        bot.sendMessage(chatId, speech.enko.onlyText, option)
      }
    } else {
      bot.sendMessage(chatId, speech.enko.question, options).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id
        bot.onReplyToMessage(chatId, messageId, (message) => {
          const messageId = message.message_id
          const text = message.text
          const hangul = gksdud(text)
          const option = { reply_to_message_id: messageId }

          bot.sendMessage(chatId, hangul, option).catch(() => {
            bot.sendMessage(chatId, speech.error, option)
          })
        })
      })
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(enko|dudgks|영한|e)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const dubeol = gksdud(text)
    const option = { reply_to_message_id: messageId }

    bot.sendMessage(chatId, dubeol, option).catch(() => {
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}
