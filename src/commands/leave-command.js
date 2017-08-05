const config = require('../config')
const speech = require('../speech')

const ADMIN_ID = config.ADMIN_ID
const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Command
  const rCommand = new RegExp(`^/(leave|나가)(@${BOT_NAME})?$`, 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }

    // Only Admin
    if (msg.from.id === ADMIN_ID) {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.leave.bye, option).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id

        bot.leaveChat(chatId).catch(() => {
          bot.deleteMessage(chatId, messageId).catch(() => {
            // Nothing
          })
        })
      }).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    } else {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.leave.permission, option).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    }
  })
}
