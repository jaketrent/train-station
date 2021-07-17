import express from 'express'

import * as db from './common/db.js'
import * as trains from './trains/index.js'

export function createApp(seedDb) {
  const app = express()

  app.set('db', db.connect(seedDb))

  app.use('/api', express.json())
  app.use('/api/trains', trains.controller)

  return app
}
