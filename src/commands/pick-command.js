const pick = require('../modules/pick')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(pick|choice|골라|선택|p)(@${BOT_NAME})?$`, 'i')
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
    bot.sendMessage(chatId, speech.pick.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const option = { reply_to_message_id: messageId }
        const output = pick(text)

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, output, option).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      })
    })
  })

  // Query Command
  const pickArgRegex = new RegExp(`^/(pick|choice|골라|선택|p)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(pickArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }
    const output = pick(text)

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, output, option).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}
