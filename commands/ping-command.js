const ping = require('../modules/ping')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  const getHTML = (result) => {
    const output = `<code>Host :</code> ${result.numeric_host}
<code>Alive:</code> ${result.alive}
<code>Time :</code> ${!isNaN(parseFloat(result.time)) ? parseFloat(result.time) + 'ms' : 'None'}
<code>Min  :</code> ${!isNaN(parseFloat(result.min)) ? parseFloat(result.min) + 'ms' : 'None'}
<code>Max  :</code> ${!isNaN(parseFloat(result.max)) ? parseFloat(result.max) + 'ms' : 'None'}
<code>Avg  :</code> ${!isNaN(parseFloat(result.avg)) ? parseFloat(result.avg) + 'ms' : 'None'}`
    return output
  }

  // Question Command
  const pingRegex = new RegExp('^/(ping|핑)(@' + BOTNAME + ')?$', 'i')
  bot.onText(pingRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId
    }

    bot.sendMessage(chatId, speech.ping.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        if (text) {
          ping(text, 3).then(result => {
            bot.sendMessage(chatId, getHTML(result), options).catch(() => {
              bot.sendMessage(chatId, speech.error, options)
            })
          }).catch(err => {
            bot.sendMessage(chatId, err.message, options).catch(() => {
              bot.sendMessage(chatId, speech.error, options)
            })
          })
        } else {
          bot.sendMessage(chatId, speech.error, options)
        }
      })
    })
  })

  // Query Command
  const pingArgsRegex = new RegExp('^/(ping|핑)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(pingArgsRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const text = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    ping(text, 3).then(result => {
      bot.sendMessage(chatId, getHTML(result), options).catch(() => {
        bot.sendMessage(chatId, speech.error, options)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, options).catch(() => {
        bot.sendMessage(chatId, speech.error, options)
      })
    })
  })
}
