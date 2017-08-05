// '=========================================================================';
// Initialization
// '=========================================================================';

const glob = require('glob-promise')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')

const config = require('./config')
const ADMIN_ID = config.ADMIN_ID
const BOT_NAME = config.BOT_NAME

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true })

console.log(`Bot Starting @${BOT_NAME}!\n`)
bot.sendMessage(ADMIN_ID, Date())

// '=========================================================================';
// Event Hooking
// '=========================================================================';

glob(path.join(__dirname, 'handlings/*.js')).then(items => {
  for (const item of items) {
    try {
      require(item)(bot)
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMIN_ID, errMessage)
    }
  }
}).catch(err => {
  bot.sendMessage(ADMIN_ID, err.message)
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
        require(item)(bot)
        const cmd = path.basename(item).split('-')[0]
        const toggle = true
        commands.push({ cmd, toggle })
      }
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMIN_ID, errMessage)
      const cmd = path.basename(item).split('-')[0]
      const toggle = false
      commands.push({ cmd, toggle })
    }
  }
}).catch(err => {
  bot.sendMessage(ADMIN_ID, err.message)
})

// status Command
setTimeout(() => {
  try {
    const cmd = 'status'
    const toggle = true
    commands.push({ cmd, toggle })
    require(path.join(__dirname, 'commands/status-command'))(bot, commands)
  } catch (e) {
    const errMessage = e.code + '\n\n' + e.stack
    bot.sendMessage(ADMIN_ID, errMessage)
  }
}, 1000)

// '=========================================================================';
// Inline Commands
// '=========================================================================';

glob(path.join(__dirname, 'commands-inline/*.js')).then(items => {
  for (const item of items) {
    try {
      require(item)(bot)
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMIN_ID, errMessage)
    }
  }
}).catch(err => {
  bot.sendMessage(ADMIN_ID, err.message)
})
