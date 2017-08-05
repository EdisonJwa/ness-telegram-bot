const uuid = require('uuid')
const youtube = require('../modules/youtube')
const config = require('../config')
const speech = require('../speech')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const regex = /^(youtube|video|유튜브|비디오|y)\s+([\s\S]+)/i
    if (regex.test(msg.query)) {
      const query = msg.query.match(regex)[2].trim()

      youtube(query).then(data => {
        const result = []
        for (const item of data) {
          result.push({
            'type': 'video',
            'id': uuid.v4(),
            'video_url': item.url,
            'mime_type': 'text/html',
            'thumb_url': item.thumbnail,
            'title': item.title
          })
        }

        bot.answerInlineQuery(msg.id, result, option).catch(err => {
          console.error(err.message)
        })
      }).catch(() => {
        const title = speech.youtube.error
        const messageText = speech.youtube.error
        const result = [{
          'type': 'article',
          'id': uuid.v4(),
          'title': title,
          'message_text': messageText
        }]

        bot.answerInlineQuery(msg.id, result, option).catch(err => {
          console.error(err.message)
        })
      })
    }
  })
}
