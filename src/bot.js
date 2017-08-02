// '=========================================================================';
// Initialization
// '=========================================================================';

const glob = require('glob-promise')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')

const config = require(process.argv[2] || './config.json')
const bot = new TelegramBot(config.bot.TOKEN, { polling: true })

let BOTNAME = config.bot.BOTNAME
bot.getMe().then(bot => {
  BOTNAME = bot.username
  console.log(`Bot Starting @${BOTNAME}!\n`)
})

// Admin Configuration
const ADMINID = config.admin.ADMINID

bot.sendMessage(ADMINID, Date())

// '=========================================================================';
// Event Hooking
// '=========================================================================';

glob(path.join(__dirname, 'handlings/*.js')).then(items => {
  for (const item of items) {
    try {
      require(item)(config, bot)
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMINID, errMessage)
    }
  }
}).catch(err => {
  bot.sendMessage(ADMINID, err.message)
})

// '=========================================================================';
// Commands
// '=========================================================================';

const commands = []
const exceptFile = ['status-command.js']

glob(path.join(__dirname, 'commands/*.js')).then(items => {
  for (const item of items) {
    try {
      if (!exceptFile.includes(path.basename(item))) {
        require(item)(config, bot)
        const cmd = path.basename(item).split('-')[0]
        const toggle = true
        commands.push({ cmd, toggle })
      }
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMINID, errMessage)
      const cmd = path.basename(item).split('-')[0]
      const toggle = false
      commands.push({ cmd, toggle })
    }
  }
}).catch(err => {
  bot.sendMessage(ADMINID, err.message)
})

// status Command
setTimeout(() => {
  try {
    const cmd = 'status'
    const toggle = true
    commands.push({ cmd, toggle })
    require(path.join(__dirname, 'commands/status-command'))(config, bot, commands)
  } catch (e) {
    const errMessage = e.code + '\n\n' + e.stack
    bot.sendMessage(ADMINID, errMessage)
  }
}, 3000)

// '=========================================================================';
// Inline Commands
// '=========================================================================';

glob(path.join(__dirname, 'commands-inline/*.js')).then(items => {
  for (const item of items) {
    try {
      require(item)(config, bot)
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMINID, errMessage)
    }
  }
}).catch(err => {
  bot.sendMessage(ADMINID, err.message)
})
