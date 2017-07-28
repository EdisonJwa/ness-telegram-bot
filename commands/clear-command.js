module.exports = (config, bot) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  const clearRegex = new RegExp('^/(clear|cls|청소)(@' + BOTNAME + ')?$', 'i')
  bot.onText(clearRegex, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const chatId = msg.chat.id

    let output = '지우는 중...\n'

    for (let i = 0; i < 45; i++) {
      output += '\n'
    }

    output += '지웠다!'

    bot.sendMessage(chatId, output)
  })
}
