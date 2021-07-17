import express from 'express'

const app = express()

app.get('', (_req, res) => {
  res.json({ wow: 'trains' })
})

export default app
