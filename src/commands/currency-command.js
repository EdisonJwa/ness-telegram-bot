const currency = require('../modules/currency')
const speech = require('../speech')

module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  // Command
  const calcRegex = new RegExp('^/(currency|환율)(@' + BOTNAME + ')?$', 'i')
  bot.onText(calcRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const option = { reply_to_message_id: messageId }

    currency().then(result => {
      const inlineKeyboard = {
        inline_keyboard: [[
          { text: 'KRW', callback_data: 'KRW' },
          { text: 'JPY', callback_data: 'JPY' },
          { text: '계산', callback_data: 'Calulation' }
        ]]
      }
      const options = {
        reply_markup: JSON.stringify(inlineKeyboard),
        reply_to_message_id: messageId,
        parse_mode: 'html'
      }

      bot.sendMessage(chatId, result, options).then(sent => {
        bot.on('callback_query', answer => {
          if (answer.data === 'KRW') {
            const inlineKeyboard = {
              inline_keyboard: [[
                { text: 'USD', callback_data: 'USD' },
                { text: 'JPY', callback_data: 'JPY' },
                { text: '계산', callback_data: 'Calulation' }
              ]]
            }

            currency('KRW', 1000).then(result => {
              const options = {
                reply_markup: JSON.stringify(inlineKeyboard),
                chat_id: chatId,
                message_id: answer.message.message_id,
                parse_mode: 'html'
              }

              bot.editMessageText(result, options).catch(() => {
                // Nothing
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          } else if (answer.data === 'USD') {
            const options = {
              reply_markup: JSON.stringify(inlineKeyboard),
              chat_id: chatId,
              message_id: answer.message.message_id,
              parse_mode: 'html'
            }

            bot.editMessageText(result, options).catch(() => {
              // Nothing
            })
          } else if (answer.data === 'JPY') {
            const inlineKeyboard = {
              inline_keyboard: [[
                { text: 'USD', callback_data: 'USD' },
                { text: 'KRW', callback_data: 'KRW' },
                { text: '계산', callback_data: 'Calulation' }
              ]]
            }

            currency('JPY', 100).then(result => {
              const options = {
                reply_markup: JSON.stringify(inlineKeyboard),
                chat_id: chatId,
                message_id: answer.message.message_id,
                parse_mode: 'html'
              }

              bot.editMessageText(result, options).catch(() => {
                // Nothing
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          } else if (answer.data === 'Calulation') {
            bot.answerCallbackQuery(answer.id, speech.currency.help, true)
          }
        })
      // Fail sendMessage()
      }).catch(err => {
        bot.sendMessage(chatId, err.message, option)
      })
    // Fail currency()
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })

  // Query Command
  const calcArgRegex = new RegExp('^/(currency|환율)(@' + BOTNAME + ')?\\s+([\\s\\S]+)', 'i')
  bot.onText(calcArgRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }
    const unit = text.split(' ')[0]
    const multiple = text.split(' ').length === 2 ? parseFloat(text.split(' ')[1]) : 1

    currency(unit, multiple).then(result => {
      const inlineKeyboard = {
        inline_keyboard: [[
          { text: 'KRW', callback_data: 'KRW' },
          { text: 'JPY', callback_data: 'JPY' },
          { text: '계산', callback_data: 'Calulation' }
        ]]
      }
      const options = {
        reply_markup: JSON.stringify(inlineKeyboard),
        reply_to_message_id: messageId,
        parse_mode: 'html'
      }

      bot.sendMessage(chatId, result, options).then(sent => {
        bot.on('callback_query', answer => {
          if (answer.data === 'KRW') {
            const inlineKeyboard = {
              inline_keyboard: [[
                { text: 'USD', callback_data: 'USD' },
                { text: 'JPY', callback_data: 'JPY' },
                { text: '계산', callback_data: 'Calulation' }
              ]]
            }

            currency('KRW', 1000).then(result => {
              const options = {
                reply_markup: JSON.stringify(inlineKeyboard),
                chat_id: chatId,
                message_id: answer.message.message_id,
                parse_mode: 'html'
              }

              bot.editMessageText(result, options).catch(() => {
                // Nothing
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          } else if (answer.data === 'USD') {
            const inlineKeyboard = {
              inline_keyboard: [[
                { text: 'KRW', callback_data: 'KRW' },
                { text: 'JPY', callback_data: 'JPY' },
                { text: '계산', callback_data: 'Calulation' }
              ]]
            }

            currency('USD').then(result => {
              const options = {
                reply_markup: JSON.stringify(inlineKeyboard),
                chat_id: chatId,
                message_id: answer.message.message_id,
                parse_mode: 'html'
              }

              bot.editMessageText(result, options).catch(() => {
                // Nothing
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          } else if (answer.data === 'JPY') {
            const inlineKeyboard = {
              inline_keyboard: [[
                { text: 'USD', callback_data: 'USD' },
                { text: 'KRW', callback_data: 'KRW' },
                { text: '계산', callback_data: 'Calulation' }
              ]]
            }

            currency('JPY', 100).then(result => {
              const options = {
                reply_markup: JSON.stringify(inlineKeyboard),
                chat_id: chatId,
                message_id: answer.message.message_id,
                parse_mode: 'html'
              }

              bot.editMessageText(result, options).catch(() => {
                // Nothing
              })
            }).catch(err => {
              bot.answerCallbackQuery(answer.id, err.message)
            })
          } else if (answer.data === 'Calulation') {
            bot.answerCallbackQuery(answer.id, speech.currency.help, true)
          }
        })
      // Fail sendMessage()
      }).catch(err => {
        bot.sendMessage(chatId, err.message, options)
      })
    // Fail currency()
    }).catch(err => {
      bot.sendMessage(chatId, err.message, option)
    })
  })
}
