import supertest from 'supertest'

import { createApp } from '../../app.js'

describe('POST /api/trains', () => {
  let request
  const existingTrain = {
    name: 'EXST',
    times: ['03:33'],
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
        times: ['badDatetime', '02:23'],
      }
      const res = await request.post('/api/trains').send({ data: train })

      expect(res.status).toEqual(400)
      expect(res.body.errors).toEqual([
        { title: 'Train name is required' },
        {
          title:
            'Train time badDatetime is malformed. Must be in hh:mm 24-hr format.',
        },
      ])
    })

    test('pre-existing train', async () => {
      const train = {
        name: existingTrain.name,
        times: ['08:41'],
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
      times: ['09:36', '10:37', '23:59', '00:00'],
    }
    const res = await request.post('/api/trains').send({ data: train })

    expect(res.status).toEqual(201)
    expect(res.body.data).toEqual(train)
  })
})

describe('GET /api/trains/overlaps/:after', () => {
  it('returns first multiple train time after time', async () => {
    const seedDb = {
      ST1: { name: 'ST1', times: ['04:44', '05:55'] },
      ST2: { name: 'ST3', times: ['03:33', '04:44', '05:55'] },
      ST3: { name: 'ST3', times: ['03:33', '04:44', '05:55'] },
    }
    const app = createApp(seedDb)
    const request = supertest(app)

    const res = await request.get('/api/trains/overlaps/02:22')

    expect(res.status).toEqual(200)
    const expectedDate = new Date()
    expectedDate.setHours(3)
    expectedDate.setMinutes(33)
    expectedDate.setSeconds(0)
    expectedDate.setMilliseconds(0)
    expect(res.body.data).toEqual({ time: expectedDate.toISOString() })
  })

  it('returns first multiple train time on next day if none after given time', async () => {
    const seedDb = {
      ST1: { name: 'ST1', times: ['04:44', '05:55'] },
      ST2: { name: 'ST2', times: ['03:33', '04:44', '05:55'] },
      ST3: { name: 'ST3', times: ['03:33', '04:44', '05:55'] },
    }
    const app = createApp(seedDb)
    const request = supertest(app)

    const res = await request.get('/api/trains/overlaps/06:33')

    expect(res.status).toEqual(200)
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() + 1)
    expectedDate.setHours(3)
    expectedDate.setMinutes(33)
    expectedDate.setSeconds(0)
    expectedDate.setMilliseconds(0)
    expect(res.body.data).toEqual({ time: expectedDate.toISOString() })
  })
})
