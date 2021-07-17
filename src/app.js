import express from 'express'

import * as trains from './trains/index.js'

export function createApp() {
  const app = express()

  app.use('/api/trains', trains.controller)

  return app
}
