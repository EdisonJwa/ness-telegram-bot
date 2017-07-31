const speech = require('../speech')

module.exports = (config, bot) => {
  bot.on('contact', (msg) => {
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const contactName = msg.contact.first_name || msg.contact.last_name
    const uid = 'user_id' in msg.contact ? msg.contact.user_id : null
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    if (uid) {
      bot.getChat(uid).then(profile => {
        const firstname = profile.first_name
        const lastname = profile.last_name || ''
        const username = profile.username ? '@' + profile.username : ''
        const result = `${contactName}${speech.contact.found}\n\n<code>First Name:</code> ${firstname}\n<code>Last Name :</code> ${lastname}\n<code>Username  :</code> ${username}`

        bot.sendMessage(chatId, result, options).catch(() => {
          // Nothing
        })
      }).catch(() => {
        // Nothing
      })
    }
  })
}
