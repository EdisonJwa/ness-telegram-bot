const translate = require('../modules/google-translate')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const translateRegex = new RegExp('^/(translate|translation|tr|번역)(@' + BOTNAME + ')?$', 'i')
  bot.onText(translateRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    if (reply.text) {
      const text = reply.text

      translate(text).then(translated => {
        bot.sendMessage(chatId, translated, option).catch(() => {
          bot.sendMessage(chatId, speech.translate.question, option)
        })
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    } else {
      bot.sendMessage(chatId, speech.translate.question, options).then(sent => {
        const messageId = sent.message_id
        const chatId = sent.chat.id
        bot.onReplyToMessage(chatId, messageId, (message) => {
          const messageId = message.message_id
          const text = message.text
          const option = { reply_to_message_id: messageId }

          translate(text).then(translated => {
            bot.sendMessage(chatId, translated, option).catch(() => {
              bot.sendMessage(chatId, speech.error, option)
            })
          }).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        })
      }).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    }
  })

  // Query Command
  const translateArgRegex = new RegExp('^/(translate|translation|tr|번역)(@' + config.bot.BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(translateArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > config.bot.TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    translate(text).then(translated => {
      bot.sendMessage(chatId, translated, option).catch(() => {
        bot.sendMessage(chatId, speech.error, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
