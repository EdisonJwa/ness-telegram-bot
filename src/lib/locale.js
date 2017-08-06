const i18n = require('i18n')
const path = require('path')

i18n.configure({
  locales: ['ko', 'en', 'ja'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'ko'
})

module.exports = i18n
