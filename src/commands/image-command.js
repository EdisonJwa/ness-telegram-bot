/**
 * @file image-command.js
 * @author Nesffer <nesffer.jimin@gmail.com>
 */

const _ = require('underscore')
const googleImage = require('../modules/google-image')
const config = require('../config')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT
const button = { url: '🌏', inline: '🔍', more: '🖼' }

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(img|image|ㅉ|짤|ㄸ|딸|ㅇㅁㅈ|이미지|ㅅㅈ|사진)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, async (msg, match) => {
    locale.locale = msg.from.language_code
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    try {
      bot.sendChatAction(chatId, 'typing')
      const sent = await bot.sendMessage(chatId, locale.__('image.question'), options)

      bot.onReplyToMessage(sent.chat.id, sent.message_id, async (message) => {
        const replyText = message.text
        const replyMessageId = message.message_id
        const replyOption = { reply_to_message_id: replyMessageId }

        if (!replyText) {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, 'Text only!', replyOption)
        } else {
          googleImage.image(replyText).then(async (results) => {
            const images = _.shuffle(results)
            const image = images[0]
            const options = {
              reply_markup: JSON.stringify({
                inline_keyboard: [[
                  { text: button.url, url: image.ru },
                  { text: button.inline, switch_inline_query_current_chat: `/image ${replyText}` },
                  { text: button.more, callback_data: 'more' }
                ]]
              }),
              reply_to_message_id: replyMessageId
            }

            let sent = {}
            try {
              bot.sendChatAction(chatId, 'upload_photo')
              sent = await bot.sendPhoto(chatId, image.ou, options)
            } catch (err) {
              logger.error(locale.__('image.error'))
              const images = _.shuffle(results)
              const image = images[0]
              bot.sendChatAction(chatId, 'upload_photo')
              sent = await bot.sendPhoto(chatId, image.ou, options)
            }

            const queue = []  // Do not click multiple
            bot.on('callback_query', async (answer) => {
              if (answer.data === 'more' && sent.message_id === answer.message.message_id) {
                if (queue.length === 0) {
                  queue.push(Date.now())  // Register queue
                  try {
                    const images = _.shuffle(results)
                    const image = images[0]
                    const options = {
                      reply_markup: JSON.stringify({
                        inline_keyboard: [[
                            { text: button.url, url: image.ru },
                            { text: button.inline, switch_inline_query_current_chat: '/image ' + replyText }
                        ]]
                      }),
                      caption: answer.from.username ? '@' + answer.from.username : answer.from.first_name,
                      reply_to_message_id: replyMessageId
                    }

                    try {
                      bot.sendChatAction(chatId, 'upload_photo')
                      await bot.sendPhoto(chatId, image.ou, options)
                      await bot.answerCallbackQuery(answer.id, locale.__('image.sent'))
                      queue.splice(0, queue.length)  // Flush
                    } catch (err) {
                      logger.error(locale.__('image.error'))
                      const images = _.shuffle(results)
                      const image = images[0]
                      bot.sendChatAction(chatId, 'upload_photo')
                      await bot.sendPhoto(chatId, image.ou, options)
                      await bot.answerCallbackQuery(answer.id, locale.__('image.sent'))
                      queue.splice(0, queue.length)  // Flush
                    }
                  } catch (err) {  // Fail sendPhoto()
                    logger.error(locale.__('image.error'))
                    bot.answerCallbackQuery(answer.id, locale.__('image.error'))
                    queue.splice(0, queue.length)  // Flush
                  }
                } else {
                  bot.answerCallbackQuery(answer.id, _.shuffle(locale.__('dont_click'))[0])  // Do not click multiple
                }
              }
            })
          }).catch(async (err) => {  // Fail googleImage.image()
            logger.error(err.message)
            try {
              bot.sendChatAction(chatId, 'typing')
              await bot.sendMessage(chatId, err.message, replyOption)
            } catch (err) {
              logger.error(err.message)
              bot.sendChatAction(chatId, 'typing')
              await bot.sendMessage(chatId, locale.__('image.error'), replyOption)
            }
          })
        }
      })
    } catch (err) {  // Fail sendMessage()
      logger.error(err.message)
      bot.sendChatAction(chatId, 'typing')
      await bot.sendMessage(chatId, locale.__('image.error'), options)
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(img|image|ㅉ|짤|ㄸ|딸|ㅇㅁㅈ|이미지|ㅅㅈ|사진)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    locale.locale = msg.from.language_code
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const option = { reply_to_message_id: messageId }

    googleImage.image(text).then(async (results) => {
      const images = _.shuffle(results)
      const image = images[0]
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [[
              { text: button.url, url: image.ru },
              { text: button.inline, switch_inline_query_current_chat: '/image ' + text },
              { text: button.more, callback_data: 'more' }
          ]]
        }),
        reply_to_message_id: messageId
      }

      let sent = {}
      try {
        bot.sendChatAction(chatId, 'upload_photo')
        sent = await bot.sendPhoto(chatId, image.ou, options)
      } catch (err) {
        logger.error(locale.__('image.error'))
        const images = _.shuffle(results)
        const image = images[0]
        bot.sendChatAction(chatId, 'upload_photo')
        sent = await bot.sendPhoto(chatId, image.ou, options)
      }

      const queue = []  // Do not click multiple
      bot.on('callback_query', async (answer) => {
        if (answer.data === 'more' && sent.message_id === answer.message.message_id) {
          if (queue.length === 0) {
            queue.push(Date.now())  // Register queue
            try {
              const images = _.shuffle(results)
              const image = images[0]
              const options = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [[
                      { text: button.url, url: image.ru },
                      { text: button.inline, switch_inline_query_current_chat: '/image ' + text }
                  ]]
                }),
                caption: answer.from.username ? '@' + answer.from.username : answer.from.first_name,
                reply_to_message_id: messageId
              }

              try {
                bot.sendChatAction(chatId, 'upload_photo')
                await bot.sendPhoto(chatId, image.ou, options)
                await bot.answerCallbackQuery(answer.id, locale.__('image.sent', text))
                queue.splice(0, queue.length)  // Flush
              } catch (err) {
                logger.error(locale.__('image.error'))
                const images = _.shuffle(results)
                const image = images[0]
                bot.sendChatAction(chatId, 'upload_photo')
                await bot.sendPhoto(chatId, image.ou, options)
                await bot.answerCallbackQuery(answer.id, locale.__('image.sent', text))
                queue.splice(0, queue.length)  // Flush
              }
            } catch (err) {  // Fail sendPhoto()
              logger.error(locale.__('image.error'))
              bot.answerCallbackQuery(answer.id, locale.__('image.error'))
              queue.splice(0, queue.length)  // Flush
            }
          } else {
            bot.answerCallbackQuery(answer.id, _.shuffle(locale.__('dont_click'))[0])  // Do not click multiple
          }
        }
      })
    }).catch(async (err) => {  // Fail googleImage.image()
      logger.error(err.message)
      try {
        bot.sendChatAction(chatId, 'typing')
        await bot.sendMessage(chatId, err.message, option)
      } catch (err) {
        logger.error(err.message)
        bot.sendChatAction(chatId, 'typing')
        await bot.sendMessage(chatId, locale.__('image.error'), option)
      }
    })
  })
}
