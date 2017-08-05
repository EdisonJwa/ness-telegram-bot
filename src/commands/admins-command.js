const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  const rCommand = new RegExp(`^/(admins|관리자)(@${BOT_NAME})?$`, 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const chatType = msg.chat.type

    if (chatType === 'private') {
      bot.sendMessage(chatId, speech.admins.error, { reply_to_message_id: messageId })
    } else {
      let output = ''

      bot.getChatAdministrators(chatId).then(results => {
        for (const item of results) {
          if (item.user.last_name) {
            if (item.status === 'creator') {
              output += `${item.user.last_name} ${item.user.first_name}(@${item.user.username}) ⭐️\n`
            } else {
              output += `${item.user.last_name} ${item.user.first_name}(@${item.user.username})\n`
            }
          } else {
            if (item.status === 'creator') {
              output += `${item.user.first_name}(@${item.user.username}) ⭐️\n`
            } else {
              output += `${item.user.first_name}(@${item.user.username})\n`
            }
          }
        }
        bot.sendMessage(chatId, output, { reply_to_message_id: messageId, disable_notification: true })
      })
    }
  })
}
