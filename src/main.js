import * as http from 'http'

import { createApp } from './app.js'

const PORT = 3000

const server = http.createServer(createApp())

server.listen(PORT, () => {
  console.log('Listening at localhost:' + PORT + '...')
})
