const uuid = require('uuid')

module.exports = (bot) => {
  bot.on('inline_query', (msg) => {
    const rClear = /^(clear|청소)$/i
    if (rClear.test(msg.query)) {
      let output = '지우는 중...\n'

      for (let i = 0; i < 45; i++) {
        output += '\n'
      }

      output += '지웠다!'

      const title = '청소'
      const messageText = output
      const result = [{
        'type': 'article',
        'id': uuid.v4(),
        'title': title,
        'message_text': messageText
      }]

      bot.answerInlineQuery(msg.id, result).catch(() => {
        // Nothing
      })
    }
  })
}
