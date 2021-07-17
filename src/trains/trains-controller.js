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

function hasErrors(errors) {
  return errors.length > 0
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

  const errors = times.map(
    (time) =>
      isNaN(new Date(time).getTime()) &&
      formatError('Train time ' + time + ' is malformed')
  )
  return errors
}

export default app
