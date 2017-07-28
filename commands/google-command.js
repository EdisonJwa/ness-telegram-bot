const google = require('../modules/google-search')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT
  const changeKorean = speech.google.changeKorean

  // Question Command
  const googleRegex = new RegExp('^/(google|구글|g|gg)(@' + BOTNAME + ')?$', 'i')
  bot.onText(googleRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const simple = match[1] === 'gg'  // if gg, no description
    const count = !simple ? 3 : 5  // if gg, count 5 else 3
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    bot.sendMessage(chatId, speech.google.question, options).then(sent => {
      const messageId = sent.message_id
      const chatId = sent.chat.id
      bot.onReplyToMessage(chatId, messageId, (message) => {
        const messageId = message.message_id
        const text = message.text
        const inlineKeyboard = JSON.stringify({
          inline_keyboard: [[
              { text: '한국어', callback_data: 'ko' }
          ]]
        })
        const option = { reply_to_message_id: messageId }
        const options = {
          reply_to_message_id: messageId,
          parse_mode: 'html',
          reply_markup: inlineKeyboard,
          disable_web_page_preview: true
        }

        google.html(text, '', simple).then(results => {
          const output = []

          for (const result of results) {
            if (output.length < count) {
              output.push(Object.values(result).join('\n'))
            }
          }

          bot.sendMessage(chatId, output.join('\n\n'), options).then(sent => {
            bot.on('callback_query', answer => {
              if (answer.data === 'ko') {
                bot.answerCallbackQuery(answer.id, changeKorean)

                google.html(text, 'ko', simple).then(results => {
                  const options = {
                    chat_id: chatId,
                    message_id: sent.message_id,
                    parse_mode: 'html',
                    disable_web_page_preview: true
                  }

                  const output = []
                  for (const result of results) {
                    if (output.length < count) {
                      output.push(Object.values(result).join('\n'))
                    }
                  }

                  bot.editMessageText(output.join('\n\n'), options).catch(err => {
                    bot.answerCallbackQuery(answer.id, err.message)
                  })
                }).catch(err => {
                  bot.answerCallbackQuery(answer.id, err.message)
                })
              }
            })
          // Fail sendMessage()
          }).catch(err => {
            bot.sendMessage(chatId, err.message, option)
          })
        // Fail google.html()
        }).catch(err => {
          bot.sendMessage(chatId, err.message, option)
        })
      })
    })
  })

  // Query Command
  const googleArgRegex = new RegExp('^/(google|구글|gg)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(googleArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const simple = match[1] === 'gg'
    const count = !simple ? 3 : 5
    const inlineKeyboard = JSON.stringify({
      inline_keyboard: [[
        { text: '한국어', callback_data: 'ko' }
      ]]
    })
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_to_message_id: messageId,
      parse_mode: 'html',
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true
    }

    google.html(text, '', simple).then(results => {
      const output = []

      for (const result of results) {
        if (output.length < count) {
          output.push(Object.values(result).join('\n'))
        }
      }

      bot.sendMessage(chatId, output.join('\n\n'), options).then(sent => {
        bot.on('callback_query', answer => {
          if (answer.data === 'ko') {
            bot.answerCallbackQuery(answer.id, changeKorean)

            google.html(text, 'ko', simple).then(results => {
              const options = {
                chat_id: chatId,
                message_id: sent.message_id,
                parse_mode: 'html',
                disable_web_page_preview: true
              }

              const output = []

              for (const result of results) {
                if (output.length < count) {
                  output.push(Object.values(result).join('\n'))
                }
              }

              bot.editMessageText(output.join('\n\n'), options).catch(err => {
                bot.answerCallbackQuery(answer.id, err.message)
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          }
        })
      // Fail sendMessage()
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    // Fail google.html()
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Slash Command
  const googleQMRegex = new RegExp('^(/{2})([\\S]+)([\\s\\S]+)', 'i')
  bot.onText(googleQMRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[2] + match[3]
    const count = 3
    const inlineKeyboard = JSON.stringify({
      inline_keyboard: [[
        { text: '한국어', callback_data: 'ko' }
      ]]
    })
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_to_message_id: messageId,
      parse_mode: 'html',
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true
    }

    google.html(text, '').then(results => {
      const output = []

      for (const result of results) {
        // Add up to 3
        if (output.length < count) {
          output.push(Object.values(result).join('\n'))
        }
      }

      bot.sendMessage(chatId, output.join('\n\n'), options).then(sent => {
        bot.on('callback_query', answer => {
          if (answer.data === 'ko') {
            bot.answerCallbackQuery(answer.id, changeKorean)

            google.html(text, 'ko').then(results => {
              const options = {
                chat_id: chatId,
                message_id: sent.message_id,
                parse_mode: 'html',
                disable_web_page_preview: true
              }

              const output = []

              for (const result of results) {
                // Add up to 3
                if (output.length < count) {
                  output.push(Object.values(result).join('\n'))
                }
              }

              bot.editMessageText(output.join('\n\n'), options).catch(err => {
                bot.answerCallbackQuery(answer.id, err.message)
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          }
        })
      // Fail sendMessage()
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    // Fail google.html()
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
