'use strict'

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
})

// Admin Configuration
const ADMINID = config.admin.ADMINID

console.log(`Bot Starting @${BOTNAME}!\n`)
bot.sendMessage(ADMINID, Date())

// '=========================================================================';
// Event Hooking
// '=========================================================================';

glob('./handlings/*.js').then(items => {
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

const commandsList = []
const exceptFile = ['status-command.js']

glob('./commands/*.js').then(items => {
  for (const item of items) {
    try {
      if (!exceptFile.includes(path.basename(item))) {
        require(item)(config, bot)
        const cmdName = path.basename(item).split('-')[0]
        commandsList.push({ name: cmdName, toggle: true })
      }
    } catch (e) {
      const errMessage = e.code + '\n\n' + e.stack
      bot.sendMessage(ADMINID, errMessage)
      const cmdName = path.basename(item).split('-')[0]
      commandsList.push({ name: cmdName, toggle: false })
    }
  }
}).catch(err => {
  bot.sendMessage(ADMINID, err.message)
})

// status Command
setTimeout(() => {
  try {
    require('./commands/status-command')(config, bot, commandsList)
    commandsList.push({ name: 'status', toggle: true })
  } catch (e) {
    const errMessage = e.code + '\n\n' + e.stack
    bot.sendMessage(ADMINID, errMessage)
  }
}, 3000)

// '=========================================================================';
// Inline Commands
// '=========================================================================';

glob('./commands-inline/*.js').then(items => {
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
