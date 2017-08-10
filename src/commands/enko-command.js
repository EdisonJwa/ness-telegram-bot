/**
 * @file enko-command.js
 * @author Nesffer <nesffer.jimin@gmail.com>
 */

const gksdud = require('gksdud')
const config = require('../config')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Question Command
  const rQuestion = new RegExp(`^/(e|enko|dudgks|영한)(@${BOT_NAME})?$`, 'i')
  bot.onText(rQuestion, async (msg, match) => {
    locale.locale = msg.from.language_code
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const reply = msg.reply_to_message
    const option = { reply_to_message_id: messageId }
    const options = {
      reply_markup: JSON.stringify({ force_reply: true, selective: true }),
      reply_to_message_id: messageId,
      parse_mode: 'html'
    }

    if (reply) {
      if (reply.text) {
        const text = reply.text
        const hangul = gksdud(text)

        try {
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, hangul, option)
        } catch (err) {
          logger.error(err.message)
          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, locale.__('error'), option)
        }
      } else {
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, locale.__('enko.onlyText'), option)
      }
    } else {
      try {
        bot.sendChatAction(chatId, 'typing')
        const sent = await bot.sendMessage(chatId, locale.__('enko.question'), options)
        bot.onReplyToMessage(sent.chat.id, sent.message_id, (message) => {
          const messageId = message.message_id
          const text = message.text
          const option = { reply_to_message_id: messageId }
          const hangul = gksdud(text)

          bot.sendChatAction(chatId, 'typing')
          bot.sendMessage(chatId, hangul, option)
        })
      } catch (err) {
        logger.error(err.message)
        bot.sendChatAction(chatId, 'typing')
        bot.sendMessage(chatId, locale.__('error'), option)
      }
    }
  })

  // Query Command
  const rQuery = new RegExp(`^/(e|enko|dudgks|영한)(@${BOT_NAME})?\\s+([\\s\\S]+)`, 'i')
  bot.onText(rQuery, (msg, match) => {
    locale.locale = msg.from.language_code
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const text = match[3]
    const hangul = gksdud(text)
    const option = { reply_to_message_id: messageId }

    try {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, hangul, option)
    } catch (err) {
      logger.error(err.message)
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, locale.__('error'), option)
    }
  })
}
