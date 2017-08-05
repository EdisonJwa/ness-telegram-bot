const translate = require('../modules/google-translate')
const speech = require('../speech')
const config = require('../config')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(translate|translation|tr|번역)(@${BOT_NAME})?$`, 'i')
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

    if (reply && reply.text) {
      const text = reply.text

      translate(text).then(translated => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, translated, option).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.translate.question, option)
        })
      }).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    } else {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.translate.question, options).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id
        bot.onReplyToMessage(chatId, messageId, (message) => {
          const messageId = message.message_id
          const text = message.text
          const option = { reply_to_message_id: messageId }

          translate(text).then(translated => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, translated, option).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.error, option)
            })
          }).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, option)
          })
        })
      }).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(translate|translation|tr|번역)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    translate(text).then(translated => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, translated, option).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
