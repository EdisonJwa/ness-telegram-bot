const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(code|코드)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }
    const reply = msg.reply_to_message

    if (reply) {
      if (reply.text) {
        const messageId = reply.message_id
        const text = reply.text
        const replyOptions = { reply_to_message_id: messageId, parse_mode: 'html' }

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, `<code>${thanConvert(text)}</code>`, replyOptions).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.code.onlyText, options)
      }
    } else {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.code.replyOnly, options).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(code|코드)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }
    const text = match[3]

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, `<code>${thanConvert(text)}</code>`, options).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}
