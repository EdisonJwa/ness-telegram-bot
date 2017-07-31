const uuid = require('uuid')
const map = require('../modules/map')

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const rMap = /^(map|지도) ([\s\S]+)/i
    if (rMap.test(msg.query)) {
      const text = msg.query.match(rMap)[2].trim()

      map.addr2coord(text).then(location => {
        const title = location.name
        const result = [{
          'type': 'location',
          'id': uuid.v4(),
          'title': title,
          'latitude': location.lat,
          'longitude': location.lon
        }]

        bot.answerInlineQuery(msg.id, result, option)
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
    }
  })
}
