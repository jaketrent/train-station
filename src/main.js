import * as http from 'http'

import { createApp } from './app.js'

const PORT = 3000

process.on('uncaughtException', handleUncaughtError)
process.on('unhandledRejection', handleUncaughtError)

function handleUncaughtError(err) {
  console.error('Uncaught error, shutting down...', err)
  process.nextTick(() => process.exit(1))
  return
}

const server = http.createServer(createApp())

server.listen(PORT, () => {
  console.log('Listening at localhost:' + PORT + '...')
})
