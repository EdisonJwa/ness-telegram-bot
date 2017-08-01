const speech = require('../speech')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const rQuestion = new RegExp('^/(code|코드)(@' + BOTNAME + ')?$', 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }
    const reply = Reflect.has(msg, 'reply_to_message') ? msg.reply_to_message : ''

    if (reply) {
      if (Reflect.has(reply, 'text')) {
        const messageId = reply.message_id
        const text = reply.text
        const replyOptions = { reply_to_message_id: messageId, parse_mode: 'html' }

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, `<code>${thanConvert(text)}</code>`, replyOptions).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.code.onlyText, options)
      }
    } else {
      // FIXME: 답장이 아닐 때 처리. highlight.js로 변경
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, '<code>개발중입니다. 답장만 지원합니다.</code>', options).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, option)
      })
    }
  })

  // Query Command
  const rQuery = new RegExp('^/(code|코드)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }
    const text = match[3]

    // FIXME: highlight.js로 변경
    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, `<code>${thanConvert(text)}</code>`, options).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}

/**
 * TODO: highlight.js 적용 https://highlightjs.org
 */
