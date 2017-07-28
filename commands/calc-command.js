const calc = require('../modules/calc')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const calcRegex = new RegExp('^/(calc|계산|c)(@' + BOTNAME + ')?$', 'i')
  bot.onText(calcRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.calc.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id

      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const option = { reply_to_message_id: messageId }

        calc(text).then(result => {
          bot.sendMessage(chatId, result, option).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Query Command
  const calcArgRegex = new RegExp('^/(calc|계산|c)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(calcArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const text = match[3]

    calc(text).then(result => {
      bot.sendMessage(chatId, result, option).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Equal Comman
  const equalArgRegex = new RegExp('^=(.+)', 'i')
  bot.onText(equalArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > config.bot.TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }
    const text = match[1]
    const ko = match[1].match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) ? match[1].match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g).length : 0

    if (ko === 0) {
      calc(text).then(result => {
        bot.sendMessage(chatId, result, option).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    }
  })
}
