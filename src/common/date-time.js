export function today() {
  return new Date()
}

export function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}

export function setTimeOnDate(date, timeString) {
  const [hh, mm] = parseTimeString(timeString)
  date.setHours(hh)
  date.setMinutes(mm)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export function formatDate(date) {
  return date.toISOString()
}

export function parseTimeString(timeString) {
  return timeString.split(':').map((n) => parseInt(n, 10))
}

export function isValidTimeString(timeString) {
  const [hh, mm] = parseTimeString(timeString)
  return (
    /^[0-9]{2}:[0-9]{2}$/.test(timeString) &&
    hh >= 0 &&
    hh <= 23 &&
    mm >= 0 &&
    mm <= 59
  )
}
