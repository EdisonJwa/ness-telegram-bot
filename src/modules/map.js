'use strict'

const request = require('request-promise-native')
const querystring = require('querystring')
const config = require('../config.json')
const speech = require('../speech')

const APIKEY = config.apikey.daumkakao.apikey
if (!APIKEY) throw new Error('DaumKakao APIKEY is missing')

/**
 * If you pass the address, return the name, lat, lon.
 * {@link https://developers.kakao.com/docs/restapi/local|Kakao Developers}
 * @param {String} query Address
 * @returns {Promise<Object, Object>} Return { name, lat, lon }
 */
const addr2coord = (query) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://dapi.kakao.com/v2/local/search/address.json?'
    const queryOptions = { 'query': query, 'page': 1, 'size': 1 }
    const url = baseUrl + querystring.stringify(queryOptions)
    const options = {
      url,
      headers: { 'Authorization': 'KakaoAK ' + APIKEY },
      timeout: 3000,
      json: true
    }

    request(options).then(json => {
      if (json && json.meta.total_count > 0) {
        const document = (json.documents || []).length > 0 ? json.documents[0] : reject(new Error(speech.map.errorCoord))

        if (document.road_address) {
          const address = document.road_address
          const name = address.address_name
          const lat = Number(address.y)
          const lon = Number(address.x)
          const result = { name, lat, lon }

          resolve(result)
        } else if (document.address) {
          const address = document.address
          const name = address.address_name
          const lat = Number(address.y)
          const lon = Number(address.x)
          const result = { name, lat, lon }  // { name: '충북 청주시', lat: 36.64249463633137, lon: 127.48894863756654 }

          resolve(result)
        }
      } else {
        reject(new Error(speech.map.errorCoord))
      }
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

/**
 * If you pass the coord, return the name, code
 * {@link https://developers.kakao.com/docs/restapi/local|Kakao Developers}
 * @param {Number} lat Latitude
 * @param {Number} lon Longitude
 * @returns {Promise<Object, Object>} Return { name, code }
 */
const coord2addr = (lat, lon) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://dapi.kakao.com/v2/local/geo/coord2address.json?'
    const queryOptions = { 'y': lat, 'x': lon, 'input_coord': 'WGS84' }
    const url = baseUrl + querystring.stringify(queryOptions)
    const options = {
      url,
      headers: { 'Authorization': 'KakaoAK ' + APIKEY },
      timeout: 3000,
      json: true
    }

    request(options).then(json => {
      if (json && json.meta.total_count > 0) {
        const document = (json.documents || []).length > 0 ? json.documents[0] : reject(new Error(speech.map.errorAddr))

        if (document.road_address) {
          const address = document.road_address
          const name = address.address_name
          const code = address.zone_no || ''
          const result = { name, code }

          resolve(result)
        } else if (document.address) {
          const address = document.address
          const name = address.address_name
          const code = address.zip_code || ''
          const result = { name, code }  // { name: '충청북도 청주시 상당구 상당로 155', code: '28542' }

          resolve(result)
        }
      } else {
        reject(new Error(speech.map.errorAddr))
      }
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

/**
 * If you pass the keyword, return the name, distance, address, lat, lon
 * {@link https://developers.kakao.com/docs/restapi/local|Kakao Developers}
 * @param {Number} lat Latitude
 * @param {Number} lon Longitude
 * @param {String} keyword Keyword
 * @returns {Promise<Object, Object>} Return { name, distance, address, lat, lon }
 */
const keyword2addr = (lat, lon, keyword) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json?'
    const queryOptions = { 'y': lat, 'x': lon, 'radius': 20000, 'query': keyword }
    const url = baseUrl + querystring.stringify(queryOptions)
    const options = {
      url,
      headers: { 'Authorization': 'KakaoAK ' + APIKEY },
      timeout: 3000,
      json: true
    }

    request(options).then(json => {
      if (json && json.meta.total_count > 0) {
        const documents = (json.documents || []).length > 0 ? json.documents.splice(0, 5) : reject(new Error(speech.map.errorPlace))

        const results = documents.map(item => {
          const name = item.place_name
          const distance = Number(item.distance)
          const address = item.road_address_name || item.address_name
          const lat = Number(item.y)
          const lon = Number(item.x)

          return { name, distance, address, lat, lon }  // { name: '청주시청', distance: 0, address: '충북 청주시 상당구 상당로 155', lat: 36.64249440424677, lon: 127.48895021246548 }
        })

        resolve(results)
      } else {
        reject(new Error(speech.map.errorPlace))
      }
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

module.exports.addr2coord = addr2coord
module.exports.coord2addr = coord2addr
module.exports.keyword2addr = keyword2addr

if (require.main === module) {
  addr2coord('서울').then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })

  coord2addr(37.566820, 126.978667).then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })

  keyword2addr(37.566820, 126.978667, '시청').then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })
}
