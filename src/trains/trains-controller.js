import express from 'express'

import { formatError, formatErrors, formatSuccess } from '../common/api.js'
import { findNextTimeMultipleTrainsRun } from './trains-service.js'

const app = express()

app.post('', (req, res) => {
  const db = req.app.get('db')
  const [errors, train] = validatePostBody(req.body)
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
  const after = req.params.after
  const errors = validateTimeString(after)

  if (hasErrors(errors)) {
    res.status(400).json(formatErrors(errors))
  } else {
    const trains = db.keys().map((key) => db.fetch(key))
    const nextTime = findNextTimeMultipleTrainsRun(trains, after)

    res.status(200).json(
      formatSuccess({
        time: formatDate(
          setTimeOnDate(nextTime < after ? tomorrow() : today(), nextTime)
        ),
      })
    )
  }
})

function today() {
  return new Date()
}

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}

function setTimeOnDate(date, timeString) {
  const [hh, mm] = parseTimeString(timeString)
  date.setHours(hh)
  date.setMinutes(mm)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

function formatDate(date) {
  return date.toISOString()
}

function validateTimeString(timeString) {
  return isValidTimeString(timeString)
    ? undefined
    : formatError(
        'Train time ' +
          timeString +
          ' is malformed. Must be in hh:mm 24-hr format.'
      )
}

function parseTimeString(timeString) {
  return timeString.split(':').map((n) => parseInt(n, 10))
}

function isValidTimeString(timeString) {
  const [hh, mm] = parseTimeString(timeString)
  return (
    /^[0-9]{2}:[0-9]{2}$/.test(timeString) &&
    hh >= 0 &&
    hh <= 23 &&
    mm >= 0 &&
    mm <= 59
  )
}

function hasErrors(errors) {
  return Array.isArray(errors) && errors.length > 0
}

function validatePostBody(body) {
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

  const errors = times.map((time) => validateTimeString(time))

  const areTimesUnique = times.length === [...new Set(times)].length
  if (!areTimesUnique) {
    errors.push(formatError('Train times must be unique'))
  }

  return errors.filter(Boolean)
}

export default app
