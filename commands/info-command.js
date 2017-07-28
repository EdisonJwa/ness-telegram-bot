const thanConvert = (str) => str.replace('<', '&lt;').replace('>', '&gt;')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  const infoRegex = new RegExp('^/(info|정보)(@' + BOTNAME + ')?$', 'i')
  bot.onText(infoRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const chatTitle = msg.chat.title || ''
    const chatType = msg.chat.type
    const fromId = msg.from.id
    const fromFirstName = msg.from.first_name || ''
    const fromLastName = msg.from.last_name || ''
    const userName = msg.from.username ? '@' + msg.from.username : ''
    const languageCode = msg.from.language_code || ''
    const reply = msg.reply_to_message || null
    if (reply) {
      // JSON Print
      bot.sendMessage(chatId, JSON.stringify(reply, null, '    '), { reply_to_message_id: messageId })
    } else {
      const output = `
<code>Message ID:</code> ${messageId}
<strong>Chat</strong>
<code>ID        :</code> ${chatId}
<code>Title     :</code> ${thanConvert(chatTitle)}
<code>Type      :</code> ${chatType}
<strong>User</strong>
<code>ID        :</code> ${fromId}
<code>First Name:</code> ${thanConvert(fromFirstName)}
<code>Last  Name:</code> ${thanConvert(fromLastName)}
<code>Username  :</code> ${userName}
<code>Lang Code :</code> ${languageCode}`
      bot.sendMessage(chatId, output, { reply_to_message_id: messageId, parse_mode: 'html' })
    }
  })
}
