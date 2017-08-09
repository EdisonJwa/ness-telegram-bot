const map = require('../modules/map')
const weather = require('../modules/weather')
const speech = require('../speech')

module.exports = (bot) => {
  bot.on('location', (msg) => {
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const lat = msg.location.latitude
    const lon = msg.location.longitude
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    map.coord2addr(lat, lon).then(location => {
      weather.weather(lat, lon).then(weatherInfo => {
        const results = `<a href="https://www.google.com/maps/preview/@${lat},${lon},17z">${location.name}</a>\n\n${weatherInfo}`

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, results, options).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, options)
        })
      }).catch(() => {
        const results = `<a href="https://www.google.com/maps/preview/@${lat},${lon},17z">${location.name}</a>`

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, results, options).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, options)
        })
      })
    }).catch(() => {
      weather.weather(lat, lon).then(weatherInfo => {
        const results = `<a href="https://www.google.com/maps/preview/@${lat},${lon},17z">${lat},${lon}</a>\n\n${weatherInfo}`

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, results, options).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.error, options)
        })
      }).catch(err => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, err.message, options)
      })
    })
  })
}
