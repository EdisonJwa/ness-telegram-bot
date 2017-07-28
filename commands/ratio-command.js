const ratio = require('../modules/ratio')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const ratioRegex = new RegExp('^/(ratio|비율)(@' + BOTNAME + ')?$', 'i')
  bot.onText(ratioRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.ratio.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        ratio(text).then(result => {
          bot.sendMessage(chatId, result, option).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        })
      })
    })
  })

  // Query Command
  const ratioArgRegex = new RegExp('^/(ratio|비율)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(ratioArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    ratio(text).then(result => {
      bot.sendMessage(chatId, result, option).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    })
  })
}
