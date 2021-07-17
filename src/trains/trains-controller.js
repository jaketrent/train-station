import express from 'express'

const app = express()

app.post('', (req, res) => {
  const db = req.app.get('db')
  const train = parseJson(req.body)
  db.set(train.name, train)
  res.status(201).json(formatJson(db.fetch(train.name)))
})

function parseJson(body) {
  return body.data
}

function formatJson(train) {
  return { data: train }
}

export default app
