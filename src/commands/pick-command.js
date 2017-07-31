const pick = require('../modules/pick')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const pickRegex = new RegExp('^/(pick|골라|선택)(@' + BOTNAME + ')?$', 'i')
  bot.onText(pickRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.pick.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const option = { reply_to_message_id: messageId }
        const output = pick(text)

        bot.sendMessage(chatId, output, option).catch(() => {
          bot.sendMessage(chatId, speech.error, option)
        })
      })
    })
  })

  // Query Command
  const pickArgRegex = new RegExp('^/(pick|골라|선택)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(pickArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }
    const output = pick(text)

    bot.sendMessage(chatId, output, option).catch(() => {
      bot.sendMessage(chatId, speech.error, option)
    })
  })
}
