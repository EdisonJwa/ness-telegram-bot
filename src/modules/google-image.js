const request = require('request-promise-native')
const cheerio = require('cheerio')
const Entities = require('html-entities').XmlEntities
const entities = new Entities()
const config = require('../config')
const speech = require('../speech')

const USER_AGENT = config.USER_AGENT

/**
 * If you pass the query, return the image array
 * @param {String} query Search Word
 * @returns {Promise<Array, Object>}
 */
const img = (query) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.google.co.kr/search?tbm=isch&q=' + encodeURIComponent(query)
    const options = {
      url,
      headers: { 'User-Agent': USER_AGENT }
    }

    try {
      const body = await request(options)
      const items = []
      const $ = await cheerio.load(body)
      await $('div[class="rg_meta notranslate"]').each((i, item) => {
        const json = JSON.parse(entities.decode($(item).html()))
        if (items.length < 50) items.push({ 'ru': json.ru, 'ou': json.ou, 'tu': json.tu })
      })

      if (items.length > 0) {
        resolve(items)
      } else {
        reject(new Error(speech.image.error))
      }
    } catch (e) {
      reject(new Error(speech.image.error))
    }
  })
}

/**
 * If you pass the query, return the image array
 * @param {String} query Search Word
 * @returns {Promise<Array, Object>}
 */
const image = (query) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.google.co.jp/search?tbm=isch&q=' + encodeURIComponent(query)
    const options = {
      url,
      headers: { 'User-Agent': USER_AGENT }
    }

    try {
      const body = await request(options)
      const items = []
      const $ = await cheerio.load(body)
      await $('div[class="rg_meta notranslate"]').each((i, item) => {
        const json = JSON.parse(entities.decode($(item).html()))
        if (items.length < 50) items.push({ 'ru': json.ru, 'ou': json.ou, 'tu': json.tu })
      })

      if (items.length > 0) {
        resolve(items)
      } else {
        reject(new Error(speech.image.error))
      }
    } catch (e) {
      reject(new Error(speech.image.error))
    }
  })
}

/**
 * If you pass the image url, return the { text, url }
 * @param {String} url Image URL
 * @returns {Promise<Object, Object>}
 */
const search = (image) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.google.com/searchbyimage'
    const params = { hl: 'ko', image_url: image }
    const options = {
      url,
      qs: params,
      headers: { 'User-Agent': USER_AGENT },
      resolveWithFullResponse: true
    }

    try {
      const res = await request(options)
      const $ = await cheerio.load(res.body)
      const text = $('a[class="_gUb"]').text()
      const url = 'https://google.com' + res.request.uri.path

      if (text && url) {
        resolve({ text, url })
      } else {
        reject(new Error(speech.image.error))
      }
    } catch (e) {
      console.log(e)
      reject(new Error(speech.image.error))
    }
  })
}

module.exports.img = img
module.exports.image = image
module.exports.search = search
