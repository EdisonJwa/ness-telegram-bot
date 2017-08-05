const config = require('../config')

const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  bot.onText(/^(ping|핑)+[!?]*$/i, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const now = msg.date * 1000
    const text = match[1]
    const option = { reply_to_message_id: messageId }

    if (/ping/i.test(text)) {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, `Pong! ${Date.now() - now}ms`, option).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, '무엥', option)
      })
    } else if (/핑/.test(text)) {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, `퐁! ${Date.now() - now}ms`, option).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, '무엥', option)
      })
    }
  })
}
