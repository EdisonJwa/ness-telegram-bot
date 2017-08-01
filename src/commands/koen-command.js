const roman = require('../modules/roman')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const rQuestion = new RegExp('^/(koen|gksdud|한영|k)(@' + BOTNAME + ')?$', 'i')
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

    bot.sendMessage(chatId, speech.koen.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const text = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        roman(text).then(async (items) => {
          const result = []

          for (const item of items) {
            await result.push(`${item.name}\n`)
            await result.push(`<code>${item.progress}</code> ${item.num}%\n`)
          }

          bot.sendMessage(chatId, result.join(''), options)
        }).catch(err => {
          bot.sendMessage(chatId, err.message, options)
        })
      })
    })
  })

  // Query Command
  const rQuery = new RegExp('^/(koen|gksdud|한영|k)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    roman(text).then(async (items) => {
      const result = []

      for (const item of items) {
        await result.push(`${item.name}\n`)
        await result.push(`<code>${item.progress}</code> ${item.num}%\n`)
      }

      bot.sendMessage(chatId, result.join(''), options)
    }).catch(err => {
      bot.sendMessage(chatId, err.message, options)
    })
  })
}

/**
 * TODO: koen-inline-command.js 구현
 */
