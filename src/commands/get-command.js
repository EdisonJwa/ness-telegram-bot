const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(get|가져와)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.get.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const num = parseInt(message.text)
        const options = { reply_to_message_id: messageId }

        if (!isNaN(num) && num <= messageId) {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, num + speech.get.bring, { reply_to_message_id: num }).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, num + speech.get.notFound, options).catch(err => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, err.message, options)
            })
          })
        } else {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.get.error, options).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, options)
          })
        }
      })
    })
  })

  // Query Command
  const getArgRegex = new RegExp(`^/(get|가져와)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(getArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const num = parseInt(match[3])
    const option = { reply_to_message_id: messageId }

    if (!isNaN(num) && num <= messageId) {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, num + speech.get.bring, { reply_to_message_id: num }).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, num + speech.get.notFound, option)
      })
    } else {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.get.error, option).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }
  })
}
