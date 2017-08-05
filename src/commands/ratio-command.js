const ratio = require('../modules/ratio')
const speech = require('../speech')
const config = require('../config')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(ratio|비율)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.ratio.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        ratio(text).then(result => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, result, option).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, option)
          })
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, option).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, option)
          })
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(ratio|비율)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    ratio(text).then(result => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, result, option).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, option).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    })
  })
}
