const config = require('../config')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT
const ADMIN_ID = config.ADMIN_ID

module.exports = (config, bot) => {
  const deleteRegex = new RegExp('^/(delete|삭제|지워)(@' + BOT_NAME + ')?$', 'i')
  bot.onText(deleteRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const option = { reply_to_message_id: messageId }

    if (reply) {
      if (reply.from.username === BOT_NAME && msg.from.id === ADMIN_ID) {
        bot.deleteMessage(reply.chat.id, reply.message_id).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, '??? 지울 수 없어요!', option)
        })
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, '개발중인 기능입니다.', option)
      }
    } else {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, '답장으로만 사용할 수 있어요!', option)
    }
  })
}
