const dday = require('../modules/dday')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(dday|디데이|d)(@${BOT_NAME})?$`, 'i')
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

    bot.sendMessage(chatId, speech.dday.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        dday(text).then(result => {
          bot.sendMessage(chatId, result, option).catch(() => {
            bot.sendMessage(chatId, speech.error, option)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option).catch(() => {
            bot.sendMessage(chatId, speech.error, option)
          })
        })
      })
    }).catch(() => {
      bot.sendMessage(chatId, speech.error, option)
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(dday|디데이|d)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    dday(text).then(result => {
      bot.sendMessage(chatId, result, option).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    })
  })
}
