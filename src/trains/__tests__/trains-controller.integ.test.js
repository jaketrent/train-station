import supertest from 'supertest'

import { createApp } from '../../app.js'

describe('POST /api/trains', () => {
  let request

  beforeAll(() => {
    const app = createApp()
    request = supertest(app)
  })

  it('creates new train', async () => {
    const train = {
      name: 'ST1',
      times: [stringTimeAt(9, 36), stringTimeAt(10, 37)],
    }
    const res = await request.post('/api/trains').send({ data: train })

    expect(res.status).toEqual(201)
    expect(res.body).toEqual({ data: train })
  })
})

function stringTimeAt(hr, min) {
  return timeAt(hr, min).toISOString()
}

function timeAt(hr, min) {
  const d = new Date()
  d.setHours(hr)
  d.setMinutes(min)
  return d
}
