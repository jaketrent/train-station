import express from 'express'

import { formatError, formatErrors, formatSuccess } from '../common/api.js'

const app = express()

app.post('', (req, res) => {
  const db = req.app.get('db')
  const [errors, train] = validateJson(req.body)
  if (hasErrors(errors)) {
    res.status(400).json(formatErrors(errors))
  } else if (db.fetch(train.name)) {
    res
      .status(409)
      .json(
        formatErrors([formatError('Train ' + train.name + ' already exists')])
      )
  } else {
    db.set(train.name, train)
    res.status(201).json(formatSuccess(db.fetch(train.name)))
  }
})

app.get('/overlaps/:after', (req, res) => {
  const db = req.app.get('db')
  const [errors, after] = parseTime(req.params.after)

  if (hasErrors(errors)) {
    res.status(400).json(formatErrors(errors))
  } else {
    const trains = db.keys().map((key) => db.fetch(key))
    const nextTime = findNextTimeMultipleTrainsRun(trains, after)
    res.status(200).json(formatSuccess({ time: formatISO8601Time(nextTime) }))
  }
})

// TODO: create service tier, thin out controller
function findNextTimeMultipleTrainsRun(trains, after) {
  return '3:33'
}

function formatISO8601Time(timeString) {
  const [, [hh, mm]] = parseTime(timeString)
  const date = new Date()
  date.setHours(hh)
  date.setMinutes(mm)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString()
}

function parseTime(timeString) {
  const time = timeString.split(':').map((n) => parseInt(n, 10))
  return [
    isValidTime(timeString)
      ? undefined
      : formatError(
          'Train time ' +
            timeString +
            ' is malformed. Must be in hh:mm 24-hr format.'
        ),
    time,
  ]
}

function isValidTime(timeString) {
  const [hh, mm] = timeString.split(':').map((n) => parseInt(n, 10))
  return (
    /^[0-9]{1,2}:[0-9]{1,2}$/.test(timeString) &&
    hh >= 0 &&
    hh <= 23 &&
    mm >= 0 &&
    mm <= 59
  )
}

function hasErrors(errors) {
  return Array.isArray(errors) && errors.length > 0
}

function validateJson(body) {
  if (!('data' in body)) return [[formatError('Malformed request')]]

  const errors = [
    validateTrainName(body.data.name),
    validateTrainTimes(body.data.times),
  ]
    .flat()
    .filter(Boolean)

  return [errors, body.data]
}

export function validateTrainName(name) {
  if (!name) return formatError('Train name is required')
  if (!/^[A-Za-z0-9]{1,4}$/.test(name))
    return formatError(
      'Train name must be between 1 and 4 alphanumeric characters'
    )
}

export function validateTrainTimes(times) {
  if (!Array.isArray(times)) return formatError('Train times is required')

  const errors = times.map((time) => parseTime(time)[0])

  return errors
}

export default app
