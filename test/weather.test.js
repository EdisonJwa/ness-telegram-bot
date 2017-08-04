const assert = require('assert')
const weather = require('../src/modules/weather')

describe('Weather', () => {
  describe('#weather.weather()', () => {
    it('If the weather return value is successful', (done) => {
      weather.weather(37.56682, 126.978667).then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('#weather.forecast()', () => {
    it('If the weather return value is successful', (done) => {
      weather.forecast(37.56682, 126.978667).then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('#weather.weatherQuery()', () => {
    it('If the weather return value is successful', (done) => {
      weather.weatherQuery('Seoul').then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('#weather.forecastQuery()', () => {
    it('If the weather return value is successful', (done) => {
      weather.forecastQuery('Seoul').then(result => {
        assert.ok(result.length > 0)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })
})
