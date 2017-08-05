const uuid = require('uuid')
const map = require('../modules/map')
const config = require('../config')
const speech = require('../speech')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const rPlace = /^(place|장소|p)\s+([\s\S]+)/i
    if (rPlace.test(msg.query)) {
      const keyword = msg.query.match(rPlace)[2].trim()
      if (keyword && msg.location) {
        const lat = msg.location.latitude
        const lon = msg.location.longitude

        map.keyword2addr(lat, lon, keyword).then(places => {
          const results = places.map(item => {
            return { 'type': 'location', 'id': uuid.v4(), 'latitude': item.lat, 'longitude': item.lon, 'title': item.name }
          })

          bot.answerInlineQuery(msg.id, results, option)
        }).catch(err => {
          const title = err.message
          const messageText = err.message
          const result = [{
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': messageText
          }]

          bot.answerInlineQuery(msg.id, result, option)
        })
      } else {
        const title = speech.map.errorLocation
        const messageText = speech.map.errorLocation
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText
        }]

        bot.answerInlineQuery(msg.id, result, option)
      }
    }
  })
}
