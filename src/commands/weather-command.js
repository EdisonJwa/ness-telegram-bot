const weather = require('../modules/weather')
const map = require('../modules/map')
const speech = require('../speech')
const config = require('../config')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp('^/(weather|날씨)(@' + BOT_NAME + ')?$', 'i')
  bot.onText(rQuestion, async (msg, match) => {
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
    bot.sendMessage(chatId, speech.weather.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }
        const enCount = text.match(/[a-zA-Z]/g) ? text.match(/[a-zA-Z]/g).length : 0

        if (enCount > 0) {
          weather.weatherQuery(text).then(weatherInfo => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, weatherInfo.join('\n'), option).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.error, option)
            })
          }).catch(err => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, err.message, option)
          })
        } else {
          map.addr2coord(text).then(location => {
            weather.weather(location.lat, location.lon).then(weatherInfo => {
              const output = `${location.name}\n\n${weatherInfo.join('\n')}`

              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, output, option).catch(() => {
                bot.sendChatAction(chatId, 'typing')
                bot.sendMessage(chatId, speech.error, option)
              })
            }).catch(err => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, err.message, option)
            })
          }).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.weather.error, option)
          })
        }
      })
    })
  })

  // Query Command
  const rQuery = new RegExp('^/(weather|날씨)(@' + BOT_NAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const text = match[3]
    const en = text.match(/[a-zA-Z]/g) ? text.match(/[a-zA-Z]/g).length : 0

    if (en > 0) {
      weather.weatherQuery(text).then(weatherInfo => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, weatherInfo.join('\n'), option).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, option)
        })
      }).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, option)
      })
    } else {
      map.addr2coord(text).then(location => {
        weather.weather(location.lat, location.lon).then(weatherInfo => {
          const output = `${location.name}\n\n${weatherInfo.join('\n')}`

          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, output, option).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.error, option)
          })
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, option)
        })
      }).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.weather.error, option)
      })
    }
  })
}
