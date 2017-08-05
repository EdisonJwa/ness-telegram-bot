const googleImage = require('../modules/google-image')
const config = require('../config')
const speech = require('../speech')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  const rCommand = new RegExp('^/(search|검색)(@' + BOT_NAME + ')?\\s*', 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    if (reply) {
      if (reply.photo) {
        bot.getFileLink(reply.photo[reply.photo.length - 1].file_id).then(photoURL => {
          googleImage.search(photoURL).then(result => {
            const output = `<a href="${result.url}">${result.text}</a>`
            bot.sendMessage(chatId, output, options).catch(err => {
              bot.sendMessage(chatId, err.message, options)
            })
          }).catch(err => {
            bot.sendMessage(chatId, err.message, options)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, options)
        })
      } else {
        bot.sendMessage(chatId, speech.search.notSupport, options).catch(err => {
          bot.sendMessage(chatId, err.message, options)
        })
      }
    } else {
      bot.sendMessage(chatId, speech.search.replyOnly, options).catch(err => {
        bot.sendMessage(chatId, err.message, options)
      })
    }
  })
}
