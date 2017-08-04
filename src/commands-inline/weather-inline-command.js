const uuid = require('uuid')
const weather = require('../modules/weather')
const map = require('../modules/map')
const speech = require('../speech')
const config = require('../config')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (config, bot) => {
  bot.on('inline_query', (msg) => {
    const rWeather = /^(weather|날씨) ([\s\S]+)/i
    if (rWeather.test(msg.query)) {
      const text = msg.query.match(rWeather)[2].trim()
      const title = `"${text}" 날씨`
      let messageText = `<strong>${text}</strong> 날씨\n\n`
      const enCount = text.match(/[a-zA-Z]/g) ? text.match(/[a-zA-Z]/g).length : 0

      if (enCount > 0) {
        weather.weatherQuery(text).then(weatherInfo => {
          const result = [{
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': weatherInfo.join('\n'),
            'parse_mode': 'html'
          }]

          bot.answerInlineQuery(msg.id, result, option)
        }).catch(err => {
          const result = [{
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': err.message,
            'parse_mode': 'html'
          }]

          bot.answerInlineQuery(msg.id, result, option)
        })
      } else {
        map.addr2coord(text).then(location => {
          weather.weather(location.lat, location.lon).then(weatherInfo => {
            const title = `"${location.name}" 날씨`
            messageText = `${location.name}\n\n${weatherInfo.join('\n')}`
            const result = [{
              'type': 'article',
              'id': uuid.v4(),
              'title': title,
              'message_text': messageText,
              'parse_mode': 'html'
            }]

            bot.answerInlineQuery(msg.id, result, option)
          }).catch(err => {
            const title = `"${location.name}" 날씨`
            messageText = err.message
            const result = [{
              'type': 'article',
              'id': uuid.v4(),
              'title': title,
              'message_text': messageText,
              'parse_mode': 'html'
            }]

            bot.answerInlineQuery(msg.id, result, option)
          })
        }).catch(err => {
          const title = err.message
          messageText += speech.weather.error
          const result = [{
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': messageText,
            'parse_mode': 'html'
          }]

          bot.answerInlineQuery(msg.id, result, option)
        })
      }
    }
  })
}
