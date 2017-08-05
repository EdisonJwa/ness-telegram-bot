const papago = require('../modules/papago')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(papago|파파고|p)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const reply = msg.reply_to_message

    if (reply) {
      if (reply.text) {
        const text = reply.text

        papago(text).then(translatedText => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, translatedText, option).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.error, option)
          })
        }).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.papago.error, option)
        })
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.papago.error, option)
      }
    } else {
      const options = {
        reply_markup: JSON.stringify({ force_reply: true, selective: true }),
        reply_to_message_id: messageId,
        parse_mode: 'html'
      }

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.papago.question, options).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id
        bot.onReplyToMessage(chatId, messageId, (message) => {
          const messageId = message.message_id
          const chatId = message.chat.id
          const option = { reply_to_message_id: messageId }
          const text = message.text

          papago(text).then(translatedText => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, translatedText, option).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.error, option)
            })
          }).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.papago.error, option)
          })
        })
      })
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(papago|파파고|p)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const text = match[3]

    papago(text).then(translatedText => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, translatedText, option).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.papago.error, option)
    })
  })
}
