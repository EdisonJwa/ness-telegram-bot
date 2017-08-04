const request = require('request-promise-native')
const speech = require('../speech')
const config = require('../config')

const appid = config.OPENWEATHERMAP_API_KEY
if (!appid) throw new Error('OpenWeatherMap APIKEY is missing')

const weather = (lat, lon) => {
  return new Promise(async (resolve, reject) => {
    const url = 'http://api.openweathermap.org/data/2.5/weather'
    const units = 'metric'
    const queryOptions = { lat, lon, units, appid }
    const options = { url, qs: queryOptions, timeout: 3000, json: true }

    try {
      const json = await request(options)
      const output = []

      const temp = `${json.main.temp}°C`
      const humidity = `${json.main.humidity}%`
      const description = json.weather[0].description

      await output.push(`${temp} / ${humidity}`)
      await output.push(description)

      resolve(output)
    } catch (e) {
      reject(new Error(speech.weather.errorRequest))
    }
  })
}

const forecast = (lat, lon) => {
  return new Promise(async (resolve, reject) => {
    const url = 'http://api.openweathermap.org/data/2.5/forecast/daily'
    const units = 'metric'
    const queryOptions = { lat, lon, units, appid }
    const options = { url, qs: queryOptions, timeout: 3000, json: true }

    try {
      const json = await request(options)
      const output = []

      if (json && json.list) {
        for (const item of json.list) {
          const date = await (new Date(item.dt * 1000)).getDate()
          await output.push(`${date}일`)
          await output.push(`${item.temp.min}~${item.temp.max}°C\n`)
          await output.push(`날씨: ${item.weather[0].description}\n\n`)
        }
      }

      resolve(output)
    } catch (e) {
      reject(new Error(speech.weather.errorRequest))
    }
  })
}

const weatherQuery = (q) => {
  return new Promise(async (resolve, reject) => {
    const url = 'http://api.openweathermap.org/data/2.5/weather'
    const units = 'metric'
    const params = { q, units, appid }
    const options = { url, qs: params, timeout: 3000, json: true }

    try {
      const json = await request(options)
      if (json.cod === '502') await reject(new Error(json.message))
      const output = []

      const name = json.name || 'None'
      const country = json.sys.country || 'None'
      const temp = json.main.temp || 'None'
      const humidity = json.main.humidity || 'None'
      const description = json.weather[0].description || 'None'

      await output.push(name)
      await output.push(country)
      await output.push(`${temp}°C`)
      await output.push(`${humidity}%`)
      await output.push(`${name}, ${country}\n\n${temp} / ${humidity}`)
      await output.push(description)

      resolve(output)
    } catch (e) {
      console.error(e.message)
      reject(new Error(speech.weather.errorRequest))
    }
  })
}

const forecastQuery = (query) => {
  return new Promise(async (resolve, reject) => {
    const url = 'http://api.openweathermap.org/data/2.5/forecast/daily'
    const units = 'metric'
    const queryOptions = { q: query, units, appid }
    const options = { url, qs: queryOptions, timeout: 3000, json: true }

    try {
      const json = await request(options)
      const output = []

      const name = json.city.name || 'None'
      const country = json.city.country || 'None'

      await output.push(`${name}, ${country}\n\n`)
      if (json && json.list) {
        for (const item of json.list) {
          const date = (new Date(item.dt * 1000)).getDate()
          const min = item.temp.min || '?'
          const max = item.temp.max || '?'
          const description = item.weather[0].description || 'None'
          await output.push(`${date}일`)
          await output.push(`${min}~${max}°C\n`)
          await output.push(`날씨: ${description}\n\n`)
        }

        resolve(output)
      } else {
        reject(new Error(speech.weather.error))
      }
    } catch (e) {
      reject(new Error(speech.weather.errorRequest))
    }
  })
}

module.exports.weather = weather
module.exports.forecast = forecast
module.exports.weatherQuery = weatherQuery
module.exports.forecastQuery = forecastQuery
