const uuid = require('uuid')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

module.exports = (config, bot) => {
  const CACHETIME = config.bot.CACHETIME
  const option = { cache_time: CACHETIME }

  bot.on('inline_query', (msg) => {
    const fromFirstName = msg.from.first_name || ''
    const fromLastName = msg.from.last_name || ''
    const userName = msg.from.username || ''
    const langCode = msg.from.language_code || ''
    let fullName = ''
    if (fromLastName) {
      if (userName) {
        fullName = `${fromLastName} ${fromFirstName}(@${userName})`
      } else {
        fullName = `${fromLastName} ${fromFirstName}`
      }
    } else {
      if (userName) {
        fullName = `${fromFirstName}(@${userName})`
      } else {
        fullName = fromFirstName
      }
    }

    const rMe = /^(info|정보)/i
    if (rMe.test(msg.query)) {
      const title = '유저 정보'
      const messageText = `${fullName}

<code>ID        :</code> ${msg.from.id}
<code>First Name:</code> ${thanConvert(fromFirstName)}
<code>Last Name :</code> ${thanConvert(fromLastName)}
<code>Username  :</code> @${userName}
<code>Lang Code :</code> ${langCode}`
      const result = [{
        'type': 'article',
        'id': uuid.v4(),
        'title': title,
        'message_text': messageText,
        'parse_mode': 'html'
      }]

      bot.answerInlineQuery(msg.id, result, option)
    }
  })
}
