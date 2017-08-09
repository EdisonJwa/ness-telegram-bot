const uuid = require('uuid')
const _ = require('underscore')
const googleImage = require('../modules/google-image')

const button = { url: '🌏', inline: '🔍', more: '🖼' }

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const regex = /^\/(img|image|ㅉ|짤|ㄸ|딸|ㅇㅁㅈ|이미지|ㅅㅈ|사진)\s+([\s\S]+)/i
    if (regex.test(msg.query)) {
      const text = msg.query.match(regex)[2].trim()
      googleImage.image(text).then(results => {
        const images = _.shuffle(results)
        const photos = []
        for (const image of images) {
          const options = {
            'type': 'photo',
            'id': uuid.v4(),
            'photo_url': image.ou,
            'thumb_url': image.tu,
            'reply_markup': {
              inline_keyboard: [[
                { text: button.url, url: image.ru },
                { text: button.inline, switch_inline_query_current_chat: '/image ' + text }
              ]]
            }
          }

          // Limit 25
          if (photos.length < 25) {
            photos.push(options)
          }
        }

        bot.answerInlineQuery(msg.id, photos)
      }).catch(err => {
        const title = 'Error! 찾을 수 없습니다.'
        const messageText = err.message
        const options = [
          {
            'type': 'article',
            'id': uuid.v4(),
            'title': title,
            'message_text': messageText,
            'parse_mode': 'html'
          }
        ]

        bot.answerInlineQuery(msg.id, options)
      })
    }
  })
}
