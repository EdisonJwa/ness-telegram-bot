const roman = require('../modules/roman')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(koen|gksdud|한영|k)(@${BOT_NAME})?$`, 'i')
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
    bot.sendMessage(chatId, speech.koen.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        roman(text).then(async (items) => {
          const result = []

          for (const item of items) {
            await result.push(`${item.name}`)
            await result.push(`<code>${item.progress}</code> ${item.num}%`)
          }

          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, result.join('\n'), options)
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, options)
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(koen|gksdud|한영|k)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    roman(text).then(async (items) => {
      const result = []

      for (const item of items) {
        await result.push(`${item.name}`)
        await result.push(`<code>${item.progress}</code> ${item.num}%`)
      }

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, result.join('\n'), options)
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, options)
    })
  })
}
