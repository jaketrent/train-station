import express from 'express'

import * as db from './common/db.js'
import * as trains from './trains/index.js'

export function createApp() {
  const app = express()

  app.set('db', db.connect())

  app.use('/api', express.json())
  app.use('/api/trains', trains.controller)

  return app
}
