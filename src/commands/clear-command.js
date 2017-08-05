const config = require('../config')

const BOT_NAME = config.BOT_NAME
const TIMEOUT = config.TIMEOUT

module.exports = (bot) => {
  // Command
  const rCommand = new RegExp(`^/(clear|cls|청소)(@${BOT_NAME})?$`, 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id

    let result = '지우는 중...\n'
    for (let i = 0; i < 45; i++) {
      result += '\n'
    }
    result += '지웠다!'

    bot.sendMessage(chatId, result)
  })
}
