/**
 * @file bot.js
 * @author Nesffer <nesffer.jimin@gmail.com>
 */

// '=========================================================================';
// Initialization
// '=========================================================================';

const TelegramBot = require('node-telegram-bot-api')
const glob = require('glob-promise')
const path = require('path')
const logger = require('./lib/logger')

const config = require('./config')
const ADMIN_ID = config.ADMIN_ID
const TOKEN = config.BOT_TOKEN
const BOT_NAME = config.BOT_NAME

const bot = new TelegramBot(TOKEN, { polling: true, interval: 100 })
bot.sendMessage(ADMIN_ID, Date())

logger.info(`Bot Starting @${BOT_NAME}!\n`)

// '=========================================================================';
// Events
// '=========================================================================';

glob(path.join(__dirname, 'events/*.js')).then(items => {
  for (const item of items) {
    try {
      const filename = path.basename(item)
      require(item)(bot)

      logger.debug(`Loaded event - ${filename}`)
    } catch (err) {
      logger.error(err.stack)
      const errMessage = err.code + '\n\n' + err.stack
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
        const filename = path.basename(item)
        const toggle = true
        commands.push({ cmd, toggle })

        logger.debug(`Loaded command - ${filename}`)
      }
    } catch (err) {
      logger.error(err.stack)
      const errMessage = err.code + '\n\n' + err.stack
      bot.sendMessage(ADMIN_ID, errMessage)

      const cmd = path.basename(item).split('-')[0]
      const toggle = false
      commands.push({ cmd, toggle })
    }
  }
}).catch(err => {
  bot.sendMessage(ADMIN_ID, err.message)
})

setTimeout(() => {
  try {
    const item = path.join(__dirname, 'commands/status-command.js')
    require(item)(bot, commands)

    const cmd = path.basename(item).split('-')[0]
    const filename = path.basename(item)
    const toggle = true
    commands.push({ cmd, toggle })

    logger.debug(`Loaded command - ${filename}`)
  } catch (err) {
    logger.error(err.stack)
    const errMessage = err.code + '\n\n' + err.stack
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

      const filename = path.basename(item)

      logger.debug(`Loaded inline - ${filename}`)
    } catch (err) {
      logger.error(err.stack)
      const errMessage = err.code + '\n\n' + err.stack
      bot.sendMessage(ADMIN_ID, errMessage)
    }
  }
}).catch(err => {
  bot.sendMessage(ADMIN_ID, err.message)
})
