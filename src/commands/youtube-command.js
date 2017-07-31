const _ = require('underscore')
const youtube = require('../modules/youtube')
const speech = require('../speech')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const rQuestion = new RegExp('^/(youtube|video|유튜브|비디오|y|v)(@' + BOTNAME + ')?$', 'i')
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
    bot.sendMessage(chatId, speech.youtube.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const query = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        youtube(query).then(data => {
          const video = _.shuffle(data)[0]
          const result = `<a href="${video.url}">${thanConvert(video.title)}</a>`

          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, result, options).catch(() => {
            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, speech.error, options)
          })
        }).catch(() => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, speech.youtube.error, options)
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp('^/(youtube|video|유튜브|비디오|y|v)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const query = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    youtube(query).then(data => {
      const video = _.shuffle(data)[0]
      const result = `<a href="${video.url}">${thanConvert(video.title)}</a>`

      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, result, options).catch(() => {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.error, options)
      })
    }).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.youtube.error, options)
    })
  })
}
