const request = require('request-promise-native')
const config = require('../config')

const youtube = (query) => {
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/search'
    const params = { 'type': 'video', 'part': 'snippet', 'q': query, 'key': config.GOOGLE_API_KEY }
    const options = {
      url,
      qs: params,
      json: true
    }

    request(options).then(json => {
      const items = json.items
      if (items.length === 0) reject(new Error('Video not found!'))

      const data = []
      for (const item of items) {
        /**
         * Choice high quality of the thumbnails
         * thumbnails: { default: { url, width, height }, medium: { url, width, height }, high: { url, width, height } }
         */
        const thumbnail = item.snippet.thumbnails[Object.keys(item.snippet.thumbnails)[Object.keys(item.snippet.thumbnails).length - 1]]
        data.push({
          title: item.snippet.title,
          url: 'https://youtu.be/' + item['id']['videoId'],
          thumbnail: thumbnail.url
        })
      }

      resolve(data)
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

module.exports = youtube

if (require.main === module) {
  youtube('J.Fla').then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err.message)
  })
}
