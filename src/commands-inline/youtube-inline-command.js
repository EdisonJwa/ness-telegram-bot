const uuid = require('uuid')
const youtube = require('../modules/youtube')
const config = require('../config')
const speech = require('../speech')
const logger = require('../lib/logger')

const CACHE_TIMEOUT = config.CACHE_TIMEOUT
const option = { cache_time: CACHE_TIMEOUT }

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const regex = /^(youtube|video|유튜브|비디오|y)\s+([\s\S]+)/i
    if (regex.test(msg.query)) {
      const query = msg.query.match(regex)[2].trim()

      youtube(query).then(videos => {
        const result = []
        for (const video of videos) {
          const messageText = `<strong>${thanConvert(video.channel)}</strong>:\n<a href="${video.url}">${thanConvert(video.title)}</a>`
          result.push({
            'type': 'video',
            'id': uuid.v4(),
            'video_url': video.url,
            'mime_type': 'text/html',
            'thumb_url': video.thumbnail,
            'title': video.title,
            'description': video.description,
            'input_message_content': {
              'message_text': messageText,
              'parse_mode': 'html'
            }
          })
        }

        bot.answerInlineQuery(msg.id, result, option).catch(err => {
          logger.error(err.message)
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
          logger.error(err.message)
        })
      })
    }
  })
}
