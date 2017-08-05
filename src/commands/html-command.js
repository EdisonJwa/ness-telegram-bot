const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/html(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html',
      disable_web_page_preview: true
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.html.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const options = {
          reply_to_message_id: messageId,
          parse_mode: 'html',
          disable_web_page_preview: true
        }

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, text, options).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.html.error, options)
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/html(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[2]
    const options = {
      reply_to_message_id: messageId,
      parse_mode: 'html',
      disable_web_page_preview: true
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, text, options).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.html.error, options)
    })
  })
}
