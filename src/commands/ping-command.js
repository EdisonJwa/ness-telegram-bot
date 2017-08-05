const ping = require('../modules/ping')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

const getHTML = (results) => {
  const output = `<code>Host :</code> ${results.numeric_host || 'None'}
<code>Alive:</code> ${results.alive || 'None'}
<code>Time :</code> ${!isNaN(parseFloat(results.time)) ? parseFloat(results.time) + 'ms' : 'None'}
<code>Min  :</code> ${!isNaN(parseFloat(results.min)) ? parseFloat(results.min) + 'ms' : 'None'}
<code>Max  :</code> ${!isNaN(parseFloat(results.max)) ? parseFloat(results.max) + 'ms' : 'None'}
<code>Avg  :</code> ${!isNaN(parseFloat(results.avg)) ? parseFloat(results.avg) + 'ms' : 'None'}`
  return output
}

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(ping|핑)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.ping.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        if (text) {
          ping(text, 3).then(results => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, getHTML(results), options).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.error, options)
            })
          }).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, options).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.error, options)
            })
          })
        } else {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, options)
        }
      })
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(ping|핑)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const text = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    ping(text, 3).then(results => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, getHTML(results), options).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, options)
      })
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, options).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, options)
      })
    })
  })
}
