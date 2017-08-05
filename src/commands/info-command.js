const config = require('../config')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Command
  const rCommand = new RegExp(`^/(info|정보)(@${BOT_NAME})?$`, 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const chatTitle = msg.chat.title
    const chatUsername = msg.chat.username ? '@' + msg.chat.username : ''
    const chatType = msg.chat.type
    const userId = msg.from.id
    const userFirstName = msg.from.first_name
    const userLastName = msg.from.last_name || ''
    const userUsername = msg.from.username ? '@' + msg.from.username : ''
    const languageCode = msg.from.language_code || ''
    const reply = msg.reply_to_message
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    if (reply) {
      const jsonStr = JSON.stringify(reply, null, '  ')  // Beautify JSON
      const output = `<code>${jsonStr}</code>`

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, output, options)
    } else {
      const output = `
<code>Message ID:</code> ${messageId}
<strong>Chat</strong>
<code>ID        :</code> ${chatId}
<code>Title     :</code> ${thanConvert(chatTitle)}
<code>Username  :</code> ${chatUsername}
<code>Type      :</code> ${chatType}
<strong>User</strong>
<code>ID        :</code> ${userId}
<code>First Name:</code> ${thanConvert(userFirstName)}
<code>Last  Name:</code> ${thanConvert(userLastName)}
<code>Username  :</code> ${userUsername}
<code>Lang Code :</code> ${languageCode}`

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, output, options)
    }
  })
}
