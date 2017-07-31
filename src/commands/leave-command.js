const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT
  const ADMINID = config.admin.ADMINID

  const leaveRegex = new RegExp('^/(leave|나가)(@' + BOTNAME + ')?$', 'i')
  bot.onText(leaveRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }

    // Only Admin
    if (msg.from.id === ADMINID) {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.leave.bye, option).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id

        bot.leaveChat(chatId).catch(() => {
          bot.deleteMessage(chatId, messageId).catch(() => {})
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
