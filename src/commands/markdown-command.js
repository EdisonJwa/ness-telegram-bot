'use strict'

const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const markdownRegex = new RegExp('^/(markdown|md)(@' + BOTNAME + ')?$', 'i')
  bot.onText(markdownRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html',
      disable_web_page_preview: true
    }

    bot.sendMessage(chatId, speech.markdown.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'markdown', disable_web_page_preview: true }

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, text, options).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, options)
        })
      })
    })
  })

  // Query Command
  const markdownArgRegex = new RegExp('^/(markdown|md)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(markdownArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'markdown', disable_web_page_preview: true }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, text, options).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, options)
    })
  })
}
