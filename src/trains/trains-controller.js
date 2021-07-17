import express from 'express'

import { formatError, formatErrors, formatSuccess } from '../common/api.js'
import { findNextTimeMultipleTrainsRun } from './trains-service.js'

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
  const after = req.params.after

  // TODO: create validate method for message
  if (!isValidTimeString(after)) {
    res
      .status(400)
      .json(
        formatErrors(
          formatError(
            'Time parameter ' +
              timeString +
              ' is malformed. Must be in hh:mm 24-hr format.'
          )
        )
      )
  } else {
    const trains = db.keys().map((key) => db.fetch(key))
    const nextTime = findNextTimeMultipleTrainsRun(trains, after)

    res.status(200).json(
      formatSuccess({
        time:
          nextTime < after
            ? addOneDay(formatISO8601Time(nextTime))
            : formatISO8601Time(nextTime),
      })
    )
  }
})

function addOneDay(date) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + 1)
  return newDate.toISOString()
}

function formatISO8601Time(timeString) {
  const [, [hh, mm]] = parseTimeString(timeString)
  const date = new Date()
  date.setHours(hh)
  date.setMinutes(mm)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString()
}

function parseTimeString(timeString) {
  const time = timeString.split(':').map((n) => parseInt(n, 10))
  return [
    isValidTimeString(timeString)
      ? undefined
      : formatError(
          'Train time ' +
            timeString +
            ' is malformed. Must be in hh:mm 24-hr format.'
        ),
    time,
  ]
}

function isValidTimeString(timeString) {
  const [hh, mm] = timeString.split(':').map((n) => parseInt(n, 10))
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

  const errors = times.map((time) => parseTimeString(time)[0])

  const areTimesUnique = times.length === [...new Set(times)].length
  if (!areTimesUnique) {
    errors.push(formatError('Train times must be unique'))
  }

  return errors.filter(Boolean)
}

export default app
