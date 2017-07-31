const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const lengthRegex = new RegExp('^/(length|len|길이)(@' + BOTNAME + ')?$', 'i')
  bot.onText(lengthRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const option = { reply_to_message_id: messageId }

    if (reply) {
      const text = reply.text
      if (text) {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, text.length, option).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.length.error, option).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      }
    } else {
      const options = {
        reply_markup: JSON.stringify({ force_reply: true, selective: true }),
        reply_to_message_id: messageId,
        parse_mode: 'html'
      }

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.length.question, options).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id
        bot.onReplyToMessage(chatId, messageId, (message) => {
          const messageId = message.message_id
          const chatId = message.chat.id
          const text = message.text
          const option = { reply_to_message_id: messageId }

          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, text.length, option).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.error, option)
          })
        })
      })
    }
  })

  // Query Command
  const lengthArgRegex = new RegExp('^/(length|len|길이)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(lengthArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, text.length, option).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}
