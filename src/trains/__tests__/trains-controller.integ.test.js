import supertest from 'supertest'

import { createApp } from '../../app.js'

describe('POST /api/trains', () => {
  let request
  const existingTrain = {
    name: 'EXST',
    times: [stringTimeAt(3, 33)],
  }

  beforeAll(() => {
    const seedDb = {
      [existingTrain.name]: existingTrain,
    }
    const app = createApp(seedDb)
    request = supertest(app)
  })

  describe('invalid trains', () => {
    test('malformed request format', async () => {
      const trainOnly = {
        name: 'ST1',
        times: [],
      }
      const malformedMissingWrapper = trainOnly
      const res = await request
        .post('/api/trains')
        .send(malformedMissingWrapper)

      expect(res.status).toEqual(400)
      expect(res.body.errors).toEqual([{ title: 'Malformed request' }])
    })

    test('bad name and times', async () => {
      const train = {
        times: ['badDatetime', stringTimeAt(2, 23)],
      }
      const res = await request.post('/api/trains').send({ data: train })

      expect(res.status).toEqual(400)
      expect(res.body.errors).toEqual([
        { title: 'Train name is required' },
        { title: 'Train time badDatetime is malformed' },
      ])
    })

    test('bad name and times', async () => {
      const train = {
        name: existingTrain.name,
        times: [stringTimeAt(8, 41)],
      }
      const res = await request.post('/api/trains').send({ data: train })

      expect(res.status).toEqual(409)
      expect(res.body.errors).toEqual([
        { title: 'Train ' + train.name + ' already exists' },
      ])
    })
  })

  it('creates new train', async () => {
    const train = {
      name: 'ST1',
      times: [stringTimeAt(9, 36), stringTimeAt(10, 37)],
    }
    const res = await request.post('/api/trains').send({ data: train })

    expect(res.status).toEqual(201)
    expect(res.body.data).toEqual(train)
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
