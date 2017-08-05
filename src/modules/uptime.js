const uptime = (milliseconds) => {
  const date = new Date(milliseconds)

  const day = date.getUTCDate() - 1  // Start 0
  const hour = date.getUTCHours()
  const min = date.getUTCMinutes()
  const sec = date.getUTCSeconds()

  return { day, hour, min, sec }
}

const format = (milliseconds) => {
  const date = uptime(milliseconds)

  if (date.day !== 0) {
    return `${date.day}일 ${date.hour}시간 ${date.min}분`
  } else if (date.hour !== 0) {
    return `${date.hour}시간 ${date.min}분`
  } else if (date.min !== 0) {
    return `${date.min}분`
  } else {
    return `${date.sec}초`
  }
}

module.exports.uptime = uptime
module.exports.format = format
