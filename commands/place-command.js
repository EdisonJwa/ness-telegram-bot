const map = require('../modules/map')
const speech = require('../speech')

const thanConvert = (str) => str.replace('<', '&lt;').replace('>', '&gt;')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Question Command
  const ddayRegex = new RegExp('^/(place|장소|p)(@' + BOTNAME + ')?$', 'i')
  bot.onText(ddayRegex, (msg, match) => {
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

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.map.questionPlace, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const keyword = message.text
        const options = {
          reply_markup: JSON.stringify({ force_reply: true, selective: true }),
          reply_to_message_id: messageId,
          parse_mode: 'html'
        }

        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, speech.map.questionAddr, options).then(sent => {
          const messageId = sent.message_id
          const chatId = sent.chat.id
          bot.onReplyToMessage(chatId, messageId, (message) => {
            const messageId = message.message_id
            const chatId = message.chat.id
            const address = message.text
            const options = { reply_to_message_id: messageId, parse_mode: 'html' }

            map.addr2coord(address).then(location => {
              map.keyword2addr(location.lat, location.lon, keyword).then(places => {
                const results = places.map(item => {
                  return `${thanConvert(item.name)} (${item.distance}m)\n<a href="https://www.google.com/maps/preview/@${item.lat},${item.lon},17z">${thanConvert(item.address)}</a>`
                })

                bot.sendChatAction(chatId, 'typing')
                bot.sendMessage(chatId, results.join('\n\n'), options).catch(() => {
                  bot.sendChatAction(chatId, 'typing')
                  bot.sendMessage(chatId, speech.map.errorPlace, options)
                })
              })
            }).catch(err => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, err.message, options)
            })
          })
        // Question address
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, options)
        })
      })
    // Question place
    }).catch(() => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, speech.error, option)
    })
  })

  // Query Command
  const ddayArgRegex = new RegExp('^/(place|장소|p)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(ddayArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const keyword = match[3]
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendChatAction(chatId, 'typing')
    bot.sendMessage(chatId, speech.map.questionAddr, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const chatId = message.chat.id
        const address = message.text
        const options = { reply_to_message_id: messageId, parse_mode: 'html' }

        map.addr2coord(address).then(location => {
          map.keyword2addr(location.lat, location.lon, keyword).then(places => {
            const results = places.map(item => {
              return `${thanConvert(item.name)} (${item.distance}m)\n<a href="https://www.google.com/maps/preview/@${item.lat},${item.lon},17z">${thanConvert(item.address)}</a>`
            })

            bot.sendChatAction(chatId, 'typing')
            bot.sendMessage(chatId, results.join('\n\n'), options).catch(() => {
              bot.sendChatAction(chatId, 'typing')
              bot.sendMessage(chatId, speech.map.errorPlace, options)
            })
          })
        }).catch(err => {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, err.message, options)
        })
      })
    // Question address
    }).catch(err => {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, err.message, options)
    })
  })
}
