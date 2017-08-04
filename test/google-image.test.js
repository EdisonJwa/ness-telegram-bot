const assert = require('assert')
const googleImage = require('../src/modules/google-image')

describe('Google Image', () => {
  describe('#googleImage.img()', () => {
    it('If the image search return value is successful', (done) => {
      googleImage.img('Node.js').then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('#googleImage.image()', () => {
    it('If the image search return value is successful', (done) => {
      googleImage.image('Node.js').then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('#googleImage.search()', () => {
    it('If the image search return value is successful', (done) => {
      googleImage.search('https://i.imgur.com/a7s4g5B.jpg').then(result => {
        assert.ok(result.text && result.url)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })
})
