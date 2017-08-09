const _ = require('underscore')
const googleImage = require('../modules/google-image')
const config = require('../config')
const speech = require('../speech')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT
const errMessage = speech.image.error  // Fail Alert
const alert = ['그만 좀 눌러요!', '빼애액!', '자꾸 누르면 힘들어요!']
const button = { url: '🌏', inline: '🔍', more: '🖼' }

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(img|image|ㅉ|짤|ㄸ|딸|ㅇㅁㅈ|이미지|ㅅㅈ|사진)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, async (msg, match) => {
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
      await bot.sendChatAction(chatId, 'typing')
      const sent = await bot.sendMessage(chatId, speech.image.question, options)

      const sentMessageId = sent.message_id
      const sentChatId = sent.chat.id
      bot.onReplyToMessage(sentChatId, sentMessageId, async (message) => {
        const replyText = message.text
        const replyMessageId = message.message_id
        const replyOption = { reply_to_message_id: replyMessageId }
        const sentMessage = `"${replyText}" 보냈어!`  // Success Alert

        if (!replyText) {
          await bot.sendChatAction(sentChatId, 'typing')
          await bot.sendMessage(sentChatId, 'Text 형식만 지원해!', replyOption)
        } else {
          googleImage.image(replyText).then(async (results) => {
            const images = _.shuffle(results)
            const image = images[0]
            const options = {
              reply_markup: JSON.stringify({
                inline_keyboard: [[
                    { text: button.url, url: image.ru },
                    { text: button.inline, switch_inline_query_current_chat: '/image ' + replyText },
                    { text: button.more, callback_data: 'more' }
                ]]
              }),
              reply_to_message_id: replyMessageId
            }

            let sent = {}
            try {
              await bot.sendChatAction(sentChatId, 'upload_photo')
              sent = await bot.sendPhoto(sentChatId, image.ou, options)
            } catch (err) {
              const images = _.shuffle(results)
              const image = images[0]
              await bot.sendChatAction(sentChatId, 'upload_photo')
              sent = await bot.sendPhoto(sentChatId, image.ou, options)
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
                      await bot.sendChatAction(sentChatId, 'upload_photo')
                      await bot.sendPhoto(sentChatId, image.ou, options)
                      await bot.answerCallbackQuery(answer.id, sentMessage)
                      queue.splice(0, queue.length)  // Flush
                    } catch (err) {
                      const images = _.shuffle(results)
                      const image = images[0]
                      await bot.sendChatAction(sentChatId, 'upload_photo')
                      await bot.sendPhoto(sentChatId, image.ou, options)
                      await bot.answerCallbackQuery(answer.id, sentMessage)
                      queue.splice(0, queue.length)  // Flush
                    }
                  } catch (err) {  // Fail sendPhoto()
                    logger.error(errMessage)
                    bot.answerCallbackQuery(answer.id, errMessage)
                    queue.splice(0, queue.length)  // Flush
                  }
                } else {
                  bot.answerCallbackQuery(answer.id, _.shuffle(alert)[0])  // Do not click multiple
                }
              }
            })
          }).catch(async (err) => {  // Fail googleImage.image()
            logger.error(err.message)
            try {
              await bot.sendChatAction(sentChatId, 'typing')
              await bot.sendMessage(sentChatId, err.message, replyOption)
            } catch (err) {
              logger.error(err.message)
              await bot.sendChatAction(sentChatId, 'typing')
              await bot.sendMessage(sentChatId, errMessage, replyOption)
            }
          })
        }
      })
    } catch (err) {  // Fail sendMessage()
      logger.error(err.message)
      await bot.sendChatAction(chatId, 'typing')
      await bot.sendMessage(chatId, errMessage, options)
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(img|image|ㅉ|짤|ㄸ|딸|ㅇㅁㅈ|이미지|ㅅㅈ|사진)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const sentMessage = `"${text}" 보냈어!`  // 성공 알림메시지
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
        await bot.sendChatAction(chatId, 'upload_photo')
        sent = await bot.sendPhoto(chatId, image.ou, options)
      } catch (err) {
        const images = _.shuffle(results)
        const image = images[0]
        await bot.sendChatAction(chatId, 'upload_photo')
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
                await bot.sendChatAction(chatId, 'upload_photo')
                await bot.sendPhoto(chatId, image.ou, options)
                await bot.answerCallbackQuery(answer.id, sentMessage)
                queue.splice(0, queue.length)  // Flush
              } catch (err) {
                const images = _.shuffle(results)
                const image = images[0]
                await bot.sendChatAction(chatId, 'upload_photo')
                await bot.sendPhoto(chatId, image.ou, options)
                await bot.answerCallbackQuery(answer.id, sentMessage)
                queue.splice(0, queue.length)  // Flush
              }
            } catch (err) {  // Fail sendPhoto()
              logger.error(errMessage)
              bot.answerCallbackQuery(answer.id, errMessage)
              queue.splice(0, queue.length)  // Flush
            }
          } else {
            bot.answerCallbackQuery(answer.id, _.shuffle(alert)[0])  // Do not click multiple
          }
        }
      })
    }).catch(async (err) => {  // Fail googleImage.image()
      logger.error(err.message)
      try {
        await bot.sendChatAction(chatId, 'typing')
        await bot.sendMessage(chatId, err.message, option)
      } catch (err) {
        logger.error(err.message)
        await bot.sendChatAction(chatId, 'typing')
        await bot.sendMessage(chatId, errMessage, option)
      }
    })
  })
}
