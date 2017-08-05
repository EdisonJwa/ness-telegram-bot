const assert = require('assert')
const uptime = require('../src/modules/uptime')

describe('Uptime', () => {
  describe('#uptime.format()', () => {
    it('반환값이 있으면 성공', () => {
      const result = uptime.format(process.uptime() * 1000)
      assert.ok(result)
    })
  })
})
