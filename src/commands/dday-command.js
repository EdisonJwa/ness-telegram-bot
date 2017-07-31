const dday = require('../modules/dday')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const ddayRegex = new RegExp('^/(dday|디데이|d)(@' + BOTNAME + ')?$', 'i')
  bot.onText(ddayRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.dday.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        dday(text).then(result => {
          bot.sendMessage(chatId, result, option).catch(() => {
            bot.sendMessage(chatId, speech.error, option)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option).catch(() => {
            bot.sendMessage(chatId, speech.error, option)
          })
        })
      })
    }).catch(() => {
      bot.sendMessage(chatId, speech.error, option)
    })
  })

  // Query Command
  const ddayArgRegex = new RegExp('^/(dday|디데이|d)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(ddayArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    dday(text).then(result => {
      bot.sendMessage(chatId, result, option).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    })
  })
}
