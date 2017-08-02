class Uptime {
  uptime () {
    const unixtime = process.uptime()
    const date = new Date(unixtime * 1000)

    const day = date.getDate() - 1  // Start 0
    const hour = date.getHours() - 9  // UnixTime is started 09:00:00
    const min = date.getMinutes()
    const sec = date.getSeconds()

    return { day, hour, min, sec }
  }

  format () {
    const uptime = this.uptime()

    if (uptime.day !== 0) {
      return `${uptime.day}일 ${uptime.hour}시간 ${uptime.min}분`
    } else if (uptime.hour !== 0) {
      return `${uptime.hour}시간 ${uptime.min}분`
    } else if (uptime.min !== 0) {
      return `${uptime.min}분`
    } else {
      return `${uptime.sec}초`
    }
  }
}

module.exports = Uptime

if (require.main === module) {
  const uptime = new Uptime()
  console.log(uptime.uptime())
  console.log(uptime.format())
}
