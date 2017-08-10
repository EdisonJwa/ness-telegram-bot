const config = require('../config')
const locale = require('../lib/locale')
const logger = require('../lib/logger')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Command
  const rCommand = new RegExp(`^/(clear|cls|ㅊㅅ|청소)(@${BOT_NAME})?$`, 'i')
  bot.onText(rCommand, (msg, match) => {
    locale.locale = msg.from.language_code
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id

    const output = []

    output.push(locale.__('clear.clearing'))
    for (let i = 0; i < 45; i++) {
      output.push('\n')
    }
    output.push(locale.__('clear.cleared'))

    try {
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, output.join('\n'))
    } catch (err) {
      logger.error(err.message)
      bot.sendChatAction(chatId, 'typing')
      bot.sendMessage(chatId, locale.__('error'))
    }
  })
}
