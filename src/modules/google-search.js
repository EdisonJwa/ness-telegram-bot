const google = require('google')
const speech = require('../speech')

const thanConvert = (str) => str ? String(str).replace('<', '&lt;').replace('>', '&gt;') : ''

/**
 * if query passed, Return the title, link, description Object.
 * @param {string} query Query
 * @param {string} [lang='en'] if 'ko', Korean Web
 * @param {boolean} [simple=false] if true, Only include the title, link
 * @returns {Promise<object>} title, link, description
 */
const search = (query, lang = 'en', simple = false) => {
  google.resultsPerPage = 10
  google.lang = 'ko'
  google.tld = 'co.kr'
  google.nextText = '다음'

  // Korean Web
  if (lang === 'ko') {
    google.requestOptions = {
      qs: {
        tbs: 'lr:lang_1ko',
        lr: 'lang_ko'
      }
    }
  }

  return new Promise((resolve, reject) => {
    google(query, (err, res) => {
      if (err) { reject(new Error(err.message)) }

      const items = []  // Object in Array

      if (res) {
        for (const item of res.links) {
          if (item.title && item.link && item.description) {
            if (!simple) {  // google
              items.push({ title: item.title, link: item.link, description: item.description })
            } else {  // gg
              items.push({ title: item.title, link: item.link })
            }
          }
        }
      } else {
        reject(new Error(speech.google.emptyResponse))
      }

      if (items.length >= 1) {
        resolve(items)
      } else {
        reject(new Error(speech.google.resultsBelow))
      }
    })
  })
}

/**
 * if query passed, Return the title, description Object.
 * @param {string} query Query
 * @param {string} [lang='en'] if 'ko', Korean Web
 * @param {boolean} [simple=false] if true, Only include title, link
 * @returns {Promise<object>} title, description
 */
const html = (query, lang = 'en', simple = false) => {
  return new Promise((resolve, reject) => {
    search(query, lang, simple).then(raws => {
      const results = raws.map(item => {
        if (!simple) {
          return { title: `<a href="${item.link}">${thanConvert(item.title)}</a>`, description: thanConvert(item.description) }
        } else {
          return { title: `<a href="${item.link}">${thanConvert(item.title)}</a>` }
        }
      })

      resolve(results)
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

module.exports.search = search
module.exports.html = html

if (require.main === module) {
  require('./google-search').html('Python', 'en', true).then(results => {
    const output = []

    for (const result of results) {
      output.push(Object.values(result).join('\n'))
    }
    console.log(output.join(''))
  })
}
