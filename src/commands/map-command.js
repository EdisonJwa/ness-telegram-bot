const map = require('../modules/map')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(map|지도)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.map.questionAddr, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        map.addr2coord(text).then(location => {
          bot.sendChatAction(chatId, 'find_location')
          bot.sendLocation(chatId, location.lat, location.lon, option).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, option)
          })
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, option)
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp(`^/(map|지도)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const text = match[3]

    map.addr2coord(text).then(location => {
      bot.sendChatAction(chatId, 'find_location')
      bot.sendLocation(chatId, location.lat, location.lon, option).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
