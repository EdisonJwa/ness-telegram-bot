const fs = require('fs')
const util = require('util')
const path = require('path')
const table = require('text-table')
const Uptime = require('../modules/uptime')
const uptime = new Uptime()
const speech = require('../speech')

const access = util.promisify(fs.access)
const readFile = util.promisify(fs.readFile)

let line = ''
;(async () => {
  try {
    await access(path.join(__dirname, '..', 'line.txt'))
    const data = await readFile(path.join(__dirname, '..', 'line.txt'), 'utf8')
    line = data.trim()
  } catch (e) {
    console.error(e.message)
  }
})()

module.exports = (config, bot, commands) => {
  const BOTNAME = config.bot.BOTNAME
  const TIMEOUT = config.bot.TIMEOUT

  const rCommand = new RegExp('^/(status|상태)(@' + BOTNAME + ')?$', 'i')
  bot.onText(rCommand, (msg, match) => {
    const time = Date.now() / 1000
    if (time - msg.date > TIMEOUT) return
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const options = { reply_to_message_id: messageId, parse_mode: 'html' }

    const result = []
    result.push(`활동: ${uptime.format()}\n`)
    if (line) result.push(`신장: ${line} L\n`)
    const memory = process.memoryUsage()
    if (memory && memory.rss) {
      const weight = (memory.rss / 1024 / 1024).toFixed(1)
      result.push(`무게: ${weight} MB\n\n`)
    }
    result.push('모듈:\n')

    ;(() => {
      return new Promise((resolve) => {
        const check = [[]]

        for (const [i, command] of commands.entries()) {
          if (command && (command.cmd && command.toggle)) {
            if (command.toggle === true) {
              if ((i + 1) % 2 === 0) {
                check[check.length - 1] = check[check.length - 1].concat(['✅', '/' + command.cmd])
                check.push([])  // New line
              } else {
                check[check.length - 1] = check[check.length - 1].concat(['✅', '/' + command.cmd])
              }
            } else {
              if ((i + 1) % 2 === 0) {
                check[check.length - 1] = check[check.length - 1].concat(['❌', command.cmd])
                check.push([])  // New line
              } else {
                check[check.length - 1] = check[check.length - 1].concat(['❌', command.cmd])
              }
            }
          }

          if (Math.ceil(commands.length / 2) === check.length) resolve(check)
        }
      })
    })().then(async (check) => {
      const t = await table(check)
      await result.push(`<code>${t}</code>`)  // Fixed font

      bot.sendMessage(chatId, result.join(''), options).catch(() => {
        bot.sendMessage(chatId, speech.error, options)
      })
    })
  })
}
